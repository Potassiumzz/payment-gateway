"""create basic bank, bank_account and transaction tables

Revision ID: 28222b4bf183
Revises: 294be7b3b7d0
Create Date: 2026-01-02 19:44:42.195922
"""

from typing import Sequence, Union

import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision: str = "28222b4bf183"
down_revision: Union[str, Sequence[str], None] = "294be7b3b7d0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
	"""Upgrade schema."""
	# Create banks table
	op.create_table(
		"banks",
		sa.Column("id", sa.Integer, primary_key=True, index=True),
		sa.Column("name", sa.String, unique=True, nullable=False, index=True),
	)

	# Create bank_accounts table
	op.create_table(
		"bank_accounts",
		sa.Column("id", sa.Integer, primary_key=True, index=True),
		sa.Column(
			"account_number", sa.Integer, unique=True, nullable=False, index=True
		),
		sa.Column("balance", sa.Numeric(10, 2), nullable=False),
		sa.Column("owner_name", sa.String, nullable=False),
		sa.Column("bank_id", sa.Integer, sa.ForeignKey("banks.id"), nullable=False),
		sa.Column("is_active", sa.Boolean, nullable=False),
	)

	# Create transactions table
	op.create_table(
		"transactions",
		sa.Column("id", sa.Integer, primary_key=True, index=True),
		sa.Column(
			"payment_intent_id",
			sa.String,
			nullable=False,
		),
		sa.Column(
			"sender_account_number",
			sa.Integer,
			sa.ForeignKey("bank_accounts.account_number"),
			nullable=False,
		),
		sa.Column(
			"receiver_account_number",
			sa.Integer,
			sa.ForeignKey("bank_accounts.account_number"),
			nullable=False,
		),
		sa.Column("amount_transferred", sa.Numeric(10, 2), nullable=False),
		sa.Column("status", sa.String, nullable=False),
		sa.Column("failure_reason", sa.String, nullable=True),
		sa.Column(
			"timestamp", sa.DateTime, nullable=False, server_default=sa.func.now()
		),
	)


def downgrade() -> None:
	"""Downgrade schema."""
	op.drop_table("transactions")
	op.drop_table("bank_accounts")
	op.drop_table("banks")
