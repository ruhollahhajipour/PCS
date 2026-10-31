using PCS.Installer.Models;

namespace PCS.Installer.Services.Pipeline;

public class InstallationPipeline
{
    private readonly List<IInstallationStep> steps = new();


    public InstallationPipeline Add(
        IInstallationStep step)
    {
        if (step == null)
        {
            throw new ArgumentNullException(
                nameof(step));
        }


        steps.Add(step);

        return this;
    }


    public async Task ExecuteAsync(
        InstallerContext context,
        IProgress<string>? messageProgress = null,
        IProgress<int>? percentageProgress = null)
    {
        if (context == null)
        {
            throw new ArgumentNullException(
                nameof(context));
        }


        if (steps.Count == 0)
        {
            percentageProgress?.Report(100);

            return;
        }


        int total =
            steps.Count;

        int completed =
            0;


        percentageProgress?.Report(0);


        foreach (IInstallationStep step in steps)
        {
            messageProgress?.Report(
                $"Starting: {step.Name}");


            try
            {
                await step.ExecuteAsync(
                    context,
                    messageProgress);


                completed++;


                int percent =
                    (int)Math.Round(
                        completed * 100.0 / total);


                percentageProgress?.Report(
                    percent);


                messageProgress?.Report(
                    $"Completed: {step.Name}");
            }
            catch (Exception ex)
            {
                messageProgress?.Report(
                    $"Failed: {step.Name}");


                string message =
                    $"Installation step failed: {step.Name}"
                    + Environment.NewLine
                    + Environment.NewLine
                    + ex.Message;


                throw new InvalidOperationException(
                    message,
                    ex);
            }
        }


        percentageProgress?.Report(100);


        messageProgress?.Report(
            "All installation steps completed successfully.");
    }
}