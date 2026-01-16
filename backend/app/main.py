import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# from app.db import Base, engine
from app.routers import account_pin, bank, bank_account, payment_intent, transaction

app = FastAPI()
load_dotenv()

frontend_url = os.getenv("FRONTEND_URL", "").split(",")

# Create tables
# Base.metadata.create_all(bind=engine)

app.include_router(bank.router)
app.include_router(bank_account.router)
app.include_router(transaction.router)
app.include_router(account_pin.router)
app.include_router(payment_intent.router)

print("frontend: ", frontend_url)

app.add_middleware(
	CORSMiddleware,
	allow_origins=frontend_url,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.get("/")
def root():
	return {"message": "HUH?"}
