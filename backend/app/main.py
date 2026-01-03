from fastapi import FastAPI

# from app.db import Base, engine
from app.routers import account_pin, bank, bank_account, payment_intent, transaction

app = FastAPI()

# Create tables
# Base.metadata.create_all(bind=engine)

app.include_router(bank.router)
app.include_router(bank_account.router)
app.include_router(transaction.router)
app.include_router(account_pin.router)
app.include_router(payment_intent.router)


@app.get("/")
def root():
	return {"message": "HUH?"}
