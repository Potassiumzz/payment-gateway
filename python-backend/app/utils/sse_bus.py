import asyncio
from typing import TypeAlias

Event: TypeAlias = dict[str, str | int]

_subscribers: list[asyncio.Queue[Event]] = []

_loop: asyncio.AbstractEventLoop | None = None


def subscribe() -> asyncio.Queue[Event]:
	q: asyncio.Queue[Event] = asyncio.Queue()
	_subscribers.append(q)
	return q


def unsubscribe(q: asyncio.Queue[Event]) -> None:
	_subscribers.remove(q)


async def publish(event: Event) -> None:
	for q in list(_subscribers):
		await q.put(event)


def set_loop(loop: asyncio.AbstractEventLoop) -> None:
	global _loop
	_loop = loop


def publish_threadsafe(event: Event) -> None:
	if _loop is None:
		return
	asyncio.run_coroutine_threadsafe(publish(event), _loop)
