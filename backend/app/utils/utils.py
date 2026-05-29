import uuid


def generate_intent_id() -> str:
	return f"k_{uuid.uuid4().hex}"
