from datetime import timedelta

from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")
MAX_ATTEMPTS = 3
LOCK_TIME = timedelta(minutes=15)


def hash_pin(pin: str) -> str:
	return pwd_context.hash(pin)


def verify_pin(pin: str, pin_hash: str) -> bool:
	return pwd_context.verify(pin, pin_hash)
