using PCS.Installer.Controls;
using PCS.Installer.Models;
using PCS.Installer.Services;
using PCS.Installer.Themes;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class InstallingPage
    : PCS.Installer.Pages.InstallerPageBase
{
    private readonly InstallerService installerService;
    private readonly InstallerContext installerContext;

    private ModernProgressBar progressBar = null!;
    private Label statusLabel = null!;
    private Label percentLabel = null!;
    private Label stageLabel = null!;
    private TextBox logBox = null!;


    public InstallingPage(
        InstallerContext context)
    {
        installerContext = context;

        installerService =
            new InstallerService(context);

        PageTitle =
            "Installing PCS";

        PageDescription =
            "Please wait while PCS is being installed.";

        BuildContent();
    }


    private void BuildContent()
    {
        SuspendLayout();

        // =========================================================
        // INSTALLATION STATUS CARD
        // =========================================================

        CardPanel progressCard =
            new CardPanel
            {
                Location =
                    new Point(
                        36,
                        32),

                Size =
                    new Size(
                        734,
                        175)
            };


        // =========================================================
        // STAGE LABEL
        // =========================================================

        stageLabel =
            new Label
            {
                Text =
                    "INSTALLATION PROGRESS",

                Location =
                    new Point(
                        24,
                        20),

                Size =
                    new Size(
                        400,
                        22),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        // =========================================================
        // STATUS
        // =========================================================

        statusLabel =
            new Label
            {
                Text =
                    "Preparing installation...",

                Location =
                    new Point(
                        24,
                        50),

                Size =
                    new Size(
                        570,
                        30),

                Font =
                    Fonts.Body,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent,

                AutoEllipsis =
                    true
            };


        // =========================================================
        // PERCENT
        // =========================================================

        percentLabel =
            new Label
            {
                Text =
                    "0%",

                Location =
                    new Point(
                        620,
                        46),

                Size =
                    new Size(
                        70,
                        36),

                Font =
                    Fonts.Progress,

                ForeColor =
                    Colors.Primary,

                BackColor =
                    Color.Transparent,

                TextAlign =
                    ContentAlignment.MiddleRight
            };


        // =========================================================
        // PROGRESS BAR
        // =========================================================

        progressBar =
            new ModernProgressBar
            {
                Location =
                    new Point(
                        24,
                        96),

                Size =
                    new Size(
                        666,
                        14),

                Minimum =
                    0,

                Maximum =
                    100,

                Value =
                    0,

                Anchor =
                    AnchorStyles.Top |
                    AnchorStyles.Left |
                    AnchorStyles.Right
            };


        // =========================================================
        // CURRENT ACTIVITY
        // =========================================================

        Label activityLabel =
            new Label
            {
                Text =
                    "Installation is running. Please do not close this window.",

                Location =
                    new Point(
                        24,
                        125),

                Size =
                    new Size(
                        666,
                        24),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextMuted,

                BackColor =
                    Color.Transparent
            };


        progressCard.Controls.Add(stageLabel);
        progressCard.Controls.Add(statusLabel);
        progressCard.Controls.Add(percentLabel);
        progressCard.Controls.Add(progressBar);
        progressCard.Controls.Add(activityLabel);


        // =========================================================
        // LOG CARD
        // =========================================================

        CardPanel logCard =
            new CardPanel
            {
                Location =
                    new Point(
                        36,
                        225),

                Size =
                    new Size(
                        734,
                        245)
            };


        Label logTitle =
            new Label
            {
                Text =
                    "Installation Activity",

                Location =
                    new Point(
                        24,
                        16),

                Size =
                    new Size(
                        400,
                        24),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        Label logDescription =
            new Label
            {
                Text =
                    "Live installation log",

                Location =
                    new Point(
                        24,
                        40),

                Size =
                    new Size(
                        400,
                        20),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextMuted,

                BackColor =
                    Color.Transparent
            };


        // =========================================================
        // LOG BOX
        // =========================================================

        logBox =
            new TextBox
            {
                Location =
                    new Point(
                        24,
                        68),

                Size =
                    new Size(
                        686,
                        150),

                Multiline =
                    true,

                ReadOnly =
                    true,

                ScrollBars =
                    ScrollBars.Vertical,

                BackColor =
                    Color.FromArgb(
                        248,
                        249,
                        251),

                ForeColor =
                    Colors.TextSecondary,

                BorderStyle =
                    BorderStyle.FixedSingle,

                Font =
                    Fonts.Small,

                Anchor =
                    AnchorStyles.Top |
                    AnchorStyles.Bottom |
                    AnchorStyles.Left |
                    AnchorStyles.Right
            };


        logCard.Controls.Add(logTitle);
        logCard.Controls.Add(logDescription);
        logCard.Controls.Add(logBox);


        // =========================================================
        // ADD TO PAGE
        // =========================================================

        Controls.Add(progressCard);
        Controls.Add(logCard);

        ResumeLayout(false);
    }


    public async Task<bool> StartInstallAsync()
    {
        try
        {
            // =====================================================
            // INITIAL STATE
            // =====================================================

            installerContext.Status =
                InstallationStatus.Running;

            installerContext.ErrorMessage =
                null;

            progressBar.Value =
                0;

            percentLabel.Text =
                "0%";

            stageLabel.Text =
                "INSTALLATION PROGRESS";

            statusLabel.Text =
                "Preparing installation...";

            logBox.Clear();


            // =====================================================
            // INITIAL LOG
            // =====================================================

            WriteLog(
                "Starting PCS installation...");

            WriteLog(
                $"Installer executable: {Environment.ProcessPath}");

            WriteLog(
                $"Application base directory: {AppContext.BaseDirectory}");

            WriteLog(
                $"Install path: {installerContext.InstallPath}");

            WriteLog(
                $"Database type: {installerContext.DatabaseType}");

            WriteLog(
                $"Database server: {installerContext.DatabaseServer}");

            WriteLog(
                $"Database name: {installerContext.DatabaseName}");

            WriteLog(
                $"Windows Authentication: {installerContext.WindowsAuthentication}");


            // =====================================================
            // MESSAGE PROGRESS
            // =====================================================

            var messageProgress =
                new Progress<string>(
                    message =>
                    {
                        if (IsDisposed)
                        {
                            return;
                        }

                        statusLabel.Text =
                            message;

                        WriteLog(message);
                    });


            // =====================================================
            // PERCENT PROGRESS
            // =====================================================

            var percentProgress =
                new Progress<int>(
                    percent =>
                    {
                        if (IsDisposed)
                        {
                            return;
                        }

                        int safePercent =
                            Math.Clamp(
                                percent,
                                0,
                                100);

                        progressBar.Value =
                            safePercent;

                        percentLabel.Text =
                            $"{safePercent}%";
                    });


            WriteLog(
                "Running installation pipeline...");


            // =====================================================
            // RUN INSTALLATION
            // =====================================================

            await installerService.InstallAsync(
                messageProgress,
                percentProgress);


            // =====================================================
            // VALIDATE RESULT
            // =====================================================

            if (installerContext.Status !=
                InstallationStatus.Completed)
            {
                throw new InvalidOperationException(
                    "Installation completed without an exception, " +
                    "but the installer status is not Completed.");
            }


            installerContext.ErrorMessage =
                null;


            // =====================================================
            // SUCCESS
            // =====================================================

            progressBar.Value =
                100;

            percentLabel.Text =
                "100%";

            stageLabel.Text =
                "INSTALLATION COMPLETE";

            statusLabel.Text =
                "Installation completed successfully.";


            WriteLog(
                "Installation completed successfully.");


            return true;
        }
        catch (Exception ex)
        {
            // =====================================================
            // FAILURE
            // =====================================================

            installerContext.Status =
                InstallationStatus.Failed;

            installerContext.ErrorMessage =
                ex.ToString();

            stageLabel.Text =
                "INSTALLATION FAILED";

            statusLabel.Text =
                "Installation failed. Please review the log below.";

            WriteLog(
                "Installation failed.");

            WriteLog(
                $"Exception type: {ex.GetType().FullName}");

            WriteLog(
                $"Error: {ex.Message}");


            if (ex.InnerException != null)
            {
                WriteLog(
                    $"Inner exception: {ex.InnerException.Message}");
            }


            WriteLog(
                "Full exception:");

            WriteLog(
                ex.ToString());


            // =====================================================
            // ERROR LOG
            // =====================================================

            string? logPath =
                WriteErrorLog(ex);


            if (!string.IsNullOrWhiteSpace(logPath))
            {
                WriteLog(
                    $"Detailed error log: {logPath}");
            }


            return false;
        }
    }


    private string? WriteErrorLog(
        Exception exception)
    {
        try
        {
            string logDirectory =
                Path.Combine(
                    Environment.GetFolderPath(
                        Environment.SpecialFolder.CommonApplicationData),
                    "PCS",
                    "Logs");


            Directory.CreateDirectory(
                logDirectory);


            string logPath =
                Path.Combine(
                    logDirectory,
                    "installer-error.log");


            string content =
                "==================================================" +
                Environment.NewLine +
                $"PCS Installer Error - {DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}" +
                Environment.NewLine +
                "==================================================" +
                Environment.NewLine +
                Environment.NewLine +
                exception +
                Environment.NewLine;


            File.WriteAllText(
                logPath,
                content);


            return logPath;
        }
        catch
        {
            return null;
        }
    }


    private void WriteLog(
        string message)
    {
        if (IsDisposed)
        {
            return;
        }

        if (logBox == null)
        {
            return;
        }


        logBox.AppendText(
            $"{DateTime.Now:HH:mm:ss} - {message}" +
            Environment.NewLine);


        logBox.SelectionStart =
            logBox.TextLength;

        logBox.ScrollToCaret();
    }
}