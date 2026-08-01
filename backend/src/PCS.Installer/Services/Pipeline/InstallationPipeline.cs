using PCS.Installer.Models;

namespace PCS.Installer.Services.Pipeline;

public class InstallationPipeline
{
    private readonly List<IInstallationStep> steps = new();



    public InstallationPipeline Add(
        IInstallationStep step)
    {
        steps.Add(step);

        return this;
    }




    public async Task ExecuteAsync(
        InstallerContext context,
        IProgress<string>? messageProgress = null,
        IProgress<int>? percentageProgress = null)
    {
        if (steps.Count == 0)
        {
            percentageProgress?.Report(100);
            return;
        }

        int total = steps.Count;

        int completed = 0;

        percentageProgress?.Report(0);

        foreach (var step in steps)
        {
            messageProgress?.Report(step.Name);

            await step.ExecuteAsync(
                context,
                messageProgress);

            completed++;

            int percent =
                (int)Math.Round(
                    completed * 100.0 / total);

            percentageProgress?.Report(percent);
        }

        percentageProgress?.Report(100);
    }
}