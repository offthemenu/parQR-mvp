"""rename location to note_location in parking_sessions

Revision ID: a70973a3fcd8
Revises: e65f32b29324
Create Date: 2025-08-02 21:52:14.106416

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'a70973a3fcd8'
down_revision: Union[str, Sequence[str], None] = 'e65f32b29324'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Rename location column to note_location (preserves data)
    op.alter_column('parking_sessions', 'location', new_column_name='note_location')


def downgrade() -> None:
    """Downgrade schema."""
    # Rename note_location column back to location
    op.alter_column('parking_sessions', 'note_location', new_column_name='location')
