from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, aliased
from sqlalchemy import or_, and_, desc, func
from typing import List
from app.db.base import get_db
from app.models.user import User
from app.models.chat_message import ChatMessage
from app.schemas.chat_schema import (
    ChatMessageCreate, 
    ChatMessageResponse, 
    ChatConversationResponse,
    MarkAsReadRequest,
    MOVE_CAR_REQUEST_MESSAGE
)
from app.dependencies.auth import get_current_user
from datetime import datetime, timezone
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/v01/chat", tags=["chat"])

@router.post("/send", response_model=ChatMessageResponse)
def send_message(
    message_data: ChatMessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a message to another user"""
    logger.info(f"Message send request from {current_user.user_code} to {message_data.recipient_user_code}")
    
    # Find recipient by user_code
    recipient = db.query(User).filter(User.user_code == message_data.recipient_user_code).first()
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
    
    # Check if trying to message themselves
    if recipient.id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot send message to yourself")
    
    # Handle special message types
    actual_message = message_data.message_content
    if message_data.message_type == 'move_car_request':
        actual_message = MOVE_CAR_REQUEST_MESSAGE
    
    # Encrypt the message
    encrypted_content, encryption_key = ChatMessage.simple_encrypt(actual_message)
    
    # Create new message
    new_message = ChatMessage(
        sender_id=current_user.id,
        recipient_id=recipient.id,
        message_content=encrypted_content,
        message_type=message_data.message_type,
        encryption_key=encryption_key,
        is_read=False
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    # Return decrypted content in response
    decrypted_content = ChatMessage.simple_decrypt(new_message.message_content, new_message.encryption_key)
    
    response = ChatMessageResponse(
        id=new_message.id,
        sender_user_code=current_user.user_code,
        recipient_user_code=recipient.user_code,
        message_content=decrypted_content,
        message_type=new_message.message_type,
        is_read=new_message.is_read,
        created_at=new_message.created_at,
        read_at=new_message.read_at
    )
    
    logger.info(f"Message sent successfully: ID {new_message.id}")
    return response

@router.get("/conversations", response_model=List[ChatConversationResponse])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all conversations for current user"""
    logger.info(f"Fetching conversations for user {current_user.user_code}")
    
    # Subquery to get latest message for each conversation
    latest_messages = db.query(
        ChatMessage.id,
        func.row_number().over(
            partition_by=func.least(ChatMessage.sender_id, ChatMessage.recipient_id),
            order_by=desc(ChatMessage.created_at)
        ).label('rn')
    ).filter(
        or_(ChatMessage.sender_id == current_user.id, ChatMessage.recipient_id == current_user.id)
    ).subquery()
    
    # Get conversations with latest message info
    conversations_query = db.query(ChatMessage, User).join(
        latest_messages, ChatMessage.id == latest_messages.c.id
    ).filter(latest_messages.c.rn == 1)
    
    conversations = []
    for message, _ in conversations_query:
        # Determine the other participant
        other_user_id = message.recipient_id if message.sender_id == current_user.id else message.sender_id
        other_user = db.query(User).filter(User.id == other_user_id).first()
        
        # Count unread messages in this conversation
        unread_count = db.query(ChatMessage).filter(
            and_(
                ChatMessage.sender_id == other_user_id,
                ChatMessage.recipient_id == current_user.id,
                ChatMessage.is_read == False
            )
        ).count()
        
        # Decrypt last message
        decrypted_content = ChatMessage.simple_decrypt(message.message_content, message.encryption_key)
        
        last_message = ChatMessageResponse(
            id=message.id,
            sender_user_code=message.sender.user_code,
            recipient_user_code=message.recipient.user_code,
            message_content=decrypted_content,
            message_type=message.message_type,
            is_read=message.is_read,
            created_at=message.created_at,
            read_at=message.read_at
        )
        
        conversation = ChatConversationResponse(
            participant_user_code=other_user.user_code,
            participant_display_name=other_user.profile_display_name or other_user.user_code,
            last_message=last_message,
            unread_count=unread_count,
            last_activity=message.created_at
        )
        conversations.append(conversation)
    
    # Sort by last activity
    conversations.sort(key=lambda x: x.last_activity, reverse=True)
    
    logger.info(f"Found {len(conversations)} conversations for user {current_user.user_code}")
    return conversations

@router.get("/messages/{user_code}", response_model=List[ChatMessageResponse])
def get_conversation_messages(
    user_code: str,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get messages in conversation with specific user"""
    logger.info(f"Fetching messages between {current_user.user_code} and {user_code}")
    
    # Find the other user
    other_user = db.query(User).filter(User.user_code == user_code).first()
    if not other_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Get messages between these two users
    messages = db.query(ChatMessage).filter(
        or_(
            and_(ChatMessage.sender_id == current_user.id, ChatMessage.recipient_id == other_user.id),
            and_(ChatMessage.sender_id == other_user.id, ChatMessage.recipient_id == current_user.id)
        )
    ).order_by(desc(ChatMessage.created_at)).offset(offset).limit(limit).all()
    
    # Decrypt and format messages
    formatted_messages = []
    for message in messages:
        decrypted_content = ChatMessage.simple_decrypt(message.message_content, message.encryption_key)
        
        formatted_message = ChatMessageResponse(
            id=message.id,
            sender_user_code=message.sender.user_code,
            recipient_user_code=message.recipient.user_code,
            message_content=decrypted_content,
            message_type=message.message_type,
            is_read=message.is_read,
            created_at=message.created_at,
            read_at=message.read_at
        )
        formatted_messages.append(formatted_message)
    
    logger.info(f"Retrieved {len(formatted_messages)} messages")
    return formatted_messages

@router.post("/mark-read")
def mark_messages_as_read(
    request: MarkAsReadRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Mark messages as read"""
    logger.info(f"Marking {len(request.message_ids)} messages as read for user {current_user.user_code}")
    
    # Update messages that belong to current user as recipient
    updated_count = db.query(ChatMessage).filter(
        and_(
            ChatMessage.id.in_(request.message_ids),
            ChatMessage.recipient_id == current_user.id,
            ChatMessage.is_read == False
        )
    ).update({
        ChatMessage.is_read: True,
        ChatMessage.read_at: datetime.now(timezone.utc)
    }, synchronize_session=False)
    
    db.commit()
    
    logger.info(f"Marked {updated_count} messages as read")
    return {"marked_as_read": updated_count}

@router.post("/move-car-request/{user_code}", response_model=ChatMessageResponse)
def send_move_car_request(
    user_code: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send a move car request to another user"""
    logger.info(f"Move car request from {current_user.user_code} to {user_code}")
    
    # Create a move car request message
    message_data = ChatMessageCreate(
        recipient_user_code=user_code,
        message_content=MOVE_CAR_REQUEST_MESSAGE,
        message_type='move_car_request'
    )
    
    # Use the regular send message endpoint
    return send_message(message_data, db, current_user)