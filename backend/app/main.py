from fastapi import FastAPI

from app.db import Base, engine
from app.routers import bank, bank_account

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

app.include_router(bank.router)
app.include_router(bank_account.router)


@app.get("/")
def root():
	return {"message": "HUH?"}
