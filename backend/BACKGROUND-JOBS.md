# Background job architecture decision

## Audit result

The repository search found no application consumers of `IBackgroundJobService`, no direct `BackgroundJob` or `RecurringJob` calls, and no concrete background job definitions.

The previous integration consisted only of an unused interface, a thin static Hangfire wrapper, a DI registration, and `Hangfire.Core`. It had no durable storage configuration and no worker registration.

## Decision

The unused Hangfire integration is removed rather than presenting an in-memory/static wrapper as production-ready infrastructure. PCS currently has no confirmed background workload that requires a job server.

When a real workload is introduced, implement it with:
- an explicit job contract and idempotency key;
- durable storage selected per deployment;
- a separately hosted worker;
- retry, timeout, dead-letter and observability policies;
- an outbox/transactional enqueue strategy when the job is caused by a database change.

Do not add Hangfire storage or a worker until at least one concrete job use case and its delivery guarantees are defined.
