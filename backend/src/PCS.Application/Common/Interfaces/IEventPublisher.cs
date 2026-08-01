using PCS.Application.Common.Events;

namespace PCS.Application.Common.Interfaces;

public interface IEventPublisher
{
    Task PublishAsync(
        IDomainEvent domainEvent);
}