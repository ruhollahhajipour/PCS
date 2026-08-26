using PCS.Domain.Entities.Planning;

namespace PCS.Application.Planning.Interfaces;

public interface IActivityRepository
{
    Task<List<Activity>> GetProjectActivitiesAsync(
        Guid projectId);


    Task<Activity?> GetByIdAsync(
        Guid id);


    void Update(
        Activity activity);


    Task SaveChangesAsync();
}
