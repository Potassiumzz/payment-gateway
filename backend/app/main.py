import os
from typing import cast

from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi_offline import FastAPIOffline

# from app.db import Base, engine
from app.routers import account_pin, bank, bank_account, payment_intent, transaction

load_dotenv()

app = FastAPIOffline(docs_url=None)

app.mount("/static", StaticFiles(directory="app/static"), name="static")


@app.get("/docs", include_in_schema=False)
async def custom_swagger_ui() -> HTMLResponse:
	html = get_swagger_ui_html(
		openapi_url="/openapi.json",
		title="API Docs",
		swagger_js_url="/static-offline-docs/swagger-ui-bundle.js",  # offline
		swagger_css_url="/static-offline-docs/swagger-ui.css",  # offline
	)
	# Inject dark mode CSS link before </head>
	dark_css = '<link rel="stylesheet" href="/static/swagger-dark.css">'
	body_str: str = cast(bytes, html.body).decode("utf-8")
	patched: str = body_str.replace("</head>", f"{dark_css}</head>")
	return HTMLResponse(content=patched)


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
