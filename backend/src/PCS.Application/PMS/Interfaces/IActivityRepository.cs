using PCS.Domain.Entities.PMS;

namespace PCS.Application.PMS.Interfaces;

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