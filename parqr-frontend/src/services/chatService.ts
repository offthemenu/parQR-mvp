import { 
  ChatMessageCreate, 
  ChatMessageResponse, 
  ChatConversationResponse,
  MarkAsReadRequest 
} from '../types';
import { apiClient } from '../config/api';

export class ChatService {
  /**
   * Send a text message to another user
   */
  static async sendMessage(messageData: ChatMessageCreate): Promise<ChatMessageResponse> {
    try {
      const response = await apiClient.post('/v01/chat/send', messageData);
      return response.data;
    } catch (error: any) {
      console.error('Send message error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Send a move car request to another user
   */
  static async sendMoveCarRequest(userCode: string): Promise<ChatMessageResponse> {
    try {
      const response = await apiClient.post(`/v01/chat/move-car-request/${userCode}`);
      return response.data;
    } catch (error: any) {
      console.error('Send move car request error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get all conversations for current user
   */
  static async getConversations(): Promise<ChatConversationResponse[]> {
    try {
      const response = await apiClient.get('/v01/chat/conversations');
      return response.data;
    } catch (error: any) {
      console.error('Get conversations error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get messages in a specific conversation
   */
  static async getConversationMessages(
    userCode: string, 
    limit: number = 50, 
    offset: number = 0
  ): Promise<ChatMessageResponse[]> {
    try {
      const response = await apiClient.get(`/v01/chat/messages/${userCode}`, {
        params: { limit, offset }
      });
      return response.data;
    } catch (error: any) {
      console.error('Get conversation messages error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Mark messages as read
   */
  static async markMessagesAsRead(messageIds: number[]): Promise<{ marked_as_read: number }> {
    try {
      const request: MarkAsReadRequest = { message_ids: messageIds };
      const response = await apiClient.post('/v01/chat/mark-read', request);
      return response.data;
    } catch (error: any) {
      console.error('Mark messages as read error:', error.response?.data || error.message);
      throw error;
    }
  }
}