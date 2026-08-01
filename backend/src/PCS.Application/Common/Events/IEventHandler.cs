namespace PCS.Application.Common.Events;

public interface IEventHandler<T>
    where T : IDomainEvent
{
    Task HandleAsync(T domainEvent);
}