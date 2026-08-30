using System;
using System.Collections.Concurrent;
using System.Threading.Channels;

namespace Ntay.Events;

public record AccountEvent(string Type, int AccountNumber);

public class AccountEventBroadcaster
{
    private readonly ConcurrentDictionary<Guid, Channel<AccountEvent>> _subscribers = new();

    public (Guid Id, ChannelReader<AccountEvent> Reader) Subscribe()
    {
        var channel = Channel.CreateUnbounded<AccountEvent>(
            new UnboundedChannelOptions { SingleReader = true, SingleWriter = false }
        );
        var id = Guid.NewGuid();
        _subscribers[id] = channel;
        return (id, channel.Reader);
    }

    public void Unsubscribe(Guid id)
    {
        if (_subscribers.TryRemove(id, out var channel))
        {
            channel.Writer.TryComplete();
        }
    }

    public void Publish(AccountEvent evt)
    {
        foreach (var channel in _subscribers.Values)
        {
            channel.Writer.TryWrite(evt);
        }
    }
}
