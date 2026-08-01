namespace PCS.Application.Common.Events;

public interface IDomainEvent
{
    DateTime OccurredOn { get; }
}