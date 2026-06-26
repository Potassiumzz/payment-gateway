import asyncio
from typing import TypeAlias

Event: TypeAlias = dict[str, str | int]

_subscribers: list[asyncio.Queue[Event]] = []


def subscribe() -> asyncio.Queue[Event]:
	q: asyncio.Queue[Event] = asyncio.Queue()
	_subscribers.append(q)
	return q


def unsubscribe(q: asyncio.Queue[Event]) -> None:
	_subscribers.remove(q)


async def publish(event: Event) -> None:
	for q in _subscribers:
		await q.put(event)
