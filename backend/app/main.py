from fastapi import FastAPI

from .db import Base, engine

app = FastAPI()

# Create tables
Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
	return {"message": "HUH?"}
