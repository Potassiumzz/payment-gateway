VENV=.venv
PYTHON=$(VENV)/bin/python
UVICORN=$(VENV)/bin/uvicorn
RUFF=$(VENV)/bin/ruff
ALEMBIC=$(VENV)/bin/alembic

run:
	$(UVICORN) --reload --port 8888 --host 0.0.0.0 app.main:app

ruff:
	$(RUFF) check --fix
	$(RUFF) format

install:
	$(PYTHON) -m pip install -r requirements.txt

migrate:
	$(ALEMBIC) upgrade head

migration:
	$(ALEMBIC) revision --autogenerate -m "$(m)"

downgrade:
	$(ALEMBIC) downgrade -1
