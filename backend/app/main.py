from fastapi import FastAPI

from app.db import Base, engine
from app.routers import bank

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)

app.include_router(bank.router)


@app.get("/")
def root():
	return {"message": "HUH?"}
