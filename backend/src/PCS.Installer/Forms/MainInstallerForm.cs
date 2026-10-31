using PCS.Installer.Controls;
using PCS.Installer.Models;
using PCS.Installer.Pages;
using PCS.Installer.Themes;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class MainInstallerForm : Form
{
    private WizardHeader header = null!;
    private StepIndicator stepIndicator = null!;
    private Panel contentPanel = null!;
    private Panel footer = null!;

    private Panel progressTrack = null!;
    private Panel progressValue = null!;

    private SecondaryButton btnBack = null!;
    private PrimaryButton btnNext = null!;
    private SecondaryButton btnCancel = null!;

    private readonly InstallerContext installerContext;
    private readonly List<UserControl> pages = new();

    private int currentStep = 0;

    private bool installationRunning;
    private bool installationFinished;


    public MainInstallerForm()
    {
        installerContext =
            new InstallerContext();

        BuildUI();

        InitializePages();

        ShowCurrentPage();

        UpdateStepIndicator();

        UpdateFooterProgress();
    }


    // ==========================================================
    // MAIN UI
    // ==========================================================

    private void BuildUI()
    {
        Text =
            "PCS | Project Control Suite";


        // ------------------------------------------------------
        // ENTERPRISE WINDOW
        // ------------------------------------------------------

        /*
         * Installer wizard window.
         *
         * Height increased by approximately 2 cm
         * compared with the previous 790 px height.
         *
         * Previous:
         *     920 x 790
         *
         * Current:
         *     920 x 870
         *
         * This affects ONLY the installer wizard window.
         * It does NOT change the PCS application UI.
         */
        ClientSize =
            new Size(
                920,
                870);

        MinimumSize =
            new Size(
                920,
                870);

        MaximumSize =
            new Size(
                920,
                870);


        StartPosition =
            FormStartPosition.CenterScreen;


        FormBorderStyle =
            FormBorderStyle.FixedSingle;

        MaximizeBox =
            false;

        MinimizeBox =
            true;


        BackColor =
            Colors.BackgroundDeep;


        DoubleBuffered =
            true;


        // ======================================================
        // HEADER
        // ======================================================

        header =
            new WizardHeader
            {
                Height =
                    96,

                // Do NOT repeat PCS here.
                // Individual pages already contain their titles.
                Title =
                    "Installation Wizard",

                Description =
                    "Project Control Suite • Setup"
            };


        // ======================================================
        // STEP NAVIGATOR
        // ======================================================

        stepIndicator =
            new StepIndicator
            {
                Height =
                    72,

                BackColor =
                    Colors.Shell
            };


        // ======================================================
        // CONTENT
        // ======================================================

        contentPanel =
            new Panel
            {
                Dock =
                    DockStyle.Fill,

                Padding =
                    new Padding(
                        28,
                        12,
                        28,
                        10),

                BackColor =
                    Colors.Background
            };


        // ======================================================
        // FOOTER
        // ======================================================

        footer =
            new Panel
            {
                Dock =
                    DockStyle.Bottom,

                Height =
                    82,

                BackColor =
                    Colors.Shell
            };


        footer.Paint +=
            Footer_Paint;


        // ======================================================
        // FOOTER PROGRESS TRACK
        // ======================================================

        progressTrack =
            new Panel
            {
                Height =
                    4,

                BackColor =
                    Colors.ProgressBack,

                Anchor =
                    AnchorStyles.Left |
                    AnchorStyles.Right |
                    AnchorStyles.Top
            };


        progressValue =
            new Panel
            {
                Height =
                    4,

                Width =
                    1,

                BackColor =
                    Colors.ProgressValue
            };


        progressTrack.Controls.Add(
            progressValue);


        footer.Controls.Add(
            progressTrack);


        // ======================================================
        // BACK
        // ======================================================

        btnBack =
            new SecondaryButton
            {
                Text =
                    "Back",

                Width =
                    94,

                Height =
                    40,

                Anchor =
                    AnchorStyles.Right |
                    AnchorStyles.Top
            };


        // ======================================================
        // NEXT
        // ======================================================

        btnNext =
            new PrimaryButton
            {
                Text =
                    "Next",

                Width =
                    112,

                Height =
                    40,

                Anchor =
                    AnchorStyles.Right |
                    AnchorStyles.Top
            };


        // ======================================================
        // CANCEL
        // ======================================================

        btnCancel =
            new SecondaryButton
            {
                Text =
                    "Cancel",

                Width =
                    94,

                Height =
                    40,

                Anchor =
                    AnchorStyles.Right |
                    AnchorStyles.Top
            };


        // ======================================================
        // BUTTON EVENTS
        // ======================================================

        btnBack.Click +=
            BtnBack_Click;

        btnNext.Click +=
            BtnNext_Click;

        btnCancel.Click +=
            BtnCancel_Click;


        // ======================================================
        // FOOTER CONTROLS
        // ======================================================

        footer.Controls.Add(
            btnBack);

        footer.Controls.Add(
            btnNext);

        footer.Controls.Add(
            btnCancel);


        // ======================================================
        // FORM CONTROLS
        // ======================================================

        Controls.Add(
            contentPanel);

        Controls.Add(
            footer);

        Controls.Add(
            stepIndicator);

        Controls.Add(
            header);


        Resize +=
            (_, _) =>
            {
                RepositionFooterControls();
            };


        Shown +=
            (_, _) =>
            {
                RepositionFooterControls();
            };
    }


    // ==========================================================
    // FOOTER PAINT
    // ==========================================================

    private void Footer_Paint(
        object? sender,
        PaintEventArgs e)
    {
        Graphics g =
            e.Graphics;

        g.SmoothingMode =
            SmoothingMode.AntiAlias;


        // ------------------------------------------------------
        // TOP BORDER
        // ------------------------------------------------------

        using Pen topLine =
            new Pen(
                Colors.Border,
                1);


        g.DrawLine(
            topLine,
            0,
            0,
            footer.Width,
            0);


        // ------------------------------------------------------
        // SUBTLE TOP ACCENT
        // ------------------------------------------------------

        if (footer.Width > 60)
        {
            using LinearGradientBrush accent =
                new LinearGradientBrush(
                    new Rectangle(
                        28,
                        1,
                        Math.Max(
                            1,
                            footer.Width - 56),
                        1),
                    Colors.Primary,
                    Colors.Accent,
                    0f);


            g.FillRectangle(
                accent,
                new Rectangle(
                    28,
                    1,
                    Math.Min(
                        240,
                        footer.Width - 56),
                    1));
        }
    }


    // ==========================================================
    // FOOTER POSITION
    // ==========================================================

    private void RepositionFooterControls()
    {
        if (footer == null ||
            btnCancel == null ||
            btnNext == null ||
            btnBack == null ||
            progressTrack == null)
        {
            return;
        }


        const int rightMargin = 28;

        const int gap = 9;


        // ------------------------------------------------------
        // PROGRESS TRACK
        // ------------------------------------------------------

        progressTrack.Left =
            28;

        progressTrack.Top =
            7;

        progressTrack.Width =
            Math.Max(
                1,
                footer.ClientSize.Width - 56);


        progressTrack.BringToFront();


        // ------------------------------------------------------
        // BUTTONS
        // ------------------------------------------------------

        int right =
            footer.ClientSize.Width -
            rightMargin;


        int buttonTop =
            27;


        // ------------------------------------------------------
        // CANCEL
        // ------------------------------------------------------

        btnCancel.Left =
            right -
            btnCancel.Width;

        btnCancel.Top =
            buttonTop;


        // ------------------------------------------------------
        // NEXT
        // ------------------------------------------------------

        btnNext.Left =
            btnCancel.Left -
            gap -
            btnNext.Width;

        btnNext.Top =
            buttonTop;


        // ------------------------------------------------------
        // BACK
        // ------------------------------------------------------

        btnBack.Left =
            btnNext.Left -
            gap -
            btnBack.Width;

        btnBack.Top =
            buttonTop;
    }


    // ==========================================================
    // FOOTER PROGRESS
    // ==========================================================

    private void UpdateFooterProgress()
    {
        if (progressTrack == null ||
            progressValue == null)
        {
            return;
        }


        int totalSteps =
            Math.Max(
                1,
                pages.Count - 1);


        float progress =
            (float)currentStep /
            totalSteps;


        progress =
            Math.Clamp(
                progress,
                0f,
                1f);


        int width =
            (int)(
                progressTrack.ClientSize.Width *
                progress);


        progressValue.Width =
            Math.Max(
                1,
                width);

        progressValue.Height =
            progressTrack.Height;

        progressValue.Left =
            0;

        progressValue.Top =
            0;
    }


    // ==========================================================
    // PAGES
    // ==========================================================

    private void InitializePages()
    {
        pages.Clear();


        pages.Add(
            new WelcomePage());


        pages.Add(
            new LicensePage(
                installerContext));


        pages.Add(
            new InstallTypePage(
                installerContext));


        pages.Add(
            new InstallLocationPage(
                installerContext));


        pages.Add(
            new DatabasePage(
                installerContext));


        pages.Add(
            new SummaryPage(
                installerContext));


        pages.Add(
            new InstallingPage(
                installerContext));


        pages.Add(
            new FinishPage(
                installerContext));
    }


    // ==========================================================
    // PAGE DISPLAY
    // ==========================================================

    private void ShowCurrentPage()
    {
        contentPanel.SuspendLayout();

        try
        {
            contentPanel.Controls.Clear();


            if (currentStep < 0 ||
                currentStep >= pages.Count)
            {
                return;
            }


            UserControl page =
                pages[currentStep];


            page.Dock =
                DockStyle.Fill;


            contentPanel.Controls.Add(
                page);
        }
        finally
        {
            contentPanel.ResumeLayout(
                true);
        }


        UpdateFooterProgress();
    }


    // ==========================================================
    // STEP / BUTTON STATE
    // ==========================================================

    private void UpdateStepIndicator()
    {
        stepIndicator.CurrentStep =
            currentStep;

        stepIndicator.Invalidate();


        UpdateFooterProgress();


        bool isFinishPage =
            currentStep ==
            pages.Count - 1;


        bool isInstallingPage =
            currentStep ==
            pages.Count - 2;


        // ------------------------------------------------------
        // BACK
        // ------------------------------------------------------

        btnBack.Enabled =
            currentStep > 0 &&
            !installationRunning &&
            !installationFinished;


        // ------------------------------------------------------
        // CANCEL
        // ------------------------------------------------------

        btnCancel.Enabled =
            !installationRunning &&
            !installationFinished;


        // ------------------------------------------------------
        // FINISH PAGE
        // ------------------------------------------------------

        if (isFinishPage)
        {
            btnBack.Enabled =
                false;

            btnCancel.Enabled =
                false;


            btnNext.Text =
                "Finish";

            btnNext.Enabled =
                !installationRunning;


            return;
        }


        // ------------------------------------------------------
        // INSTALLING PAGE
        // ------------------------------------------------------

        if (isInstallingPage)
        {
            btnNext.Text =
                "Installing...";

            btnNext.Enabled =
                false;

            btnBack.Enabled =
                false;

            btnCancel.Enabled =
                false;


            return;
        }


        // ------------------------------------------------------
        // NORMAL PAGE
        // ------------------------------------------------------

        btnNext.Text =
            "Next";

        btnNext.Enabled =
            !installationRunning;
    }


    // ==========================================================
    // NEXT
    // ==========================================================

    private async void BtnNext_Click(
        object? sender,
        EventArgs e)
    {
        if (installationRunning)
        {
            return;
        }


        // ------------------------------------------------------
        // FINISH
        // ------------------------------------------------------

        if (currentStep ==
            pages.Count - 1)
        {
            Close();

            return;
        }


        // ------------------------------------------------------
        // SUMMARY -> INSTALL
        // ------------------------------------------------------

        if (currentStep ==
            pages.Count - 3)
        {
            await StartInstallationAsync();

            return;
        }


        // ------------------------------------------------------
        // NORMAL NEXT
        // ------------------------------------------------------

        if (currentStep <
            pages.Count - 1)
        {
            currentStep++;


            ShowCurrentPage();

            UpdateStepIndicator();
        }
    }


    // ==========================================================
    // INSTALLATION
    // ==========================================================

    private async Task StartInstallationAsync()
    {
        installationRunning =
            true;

        installationFinished =
            false;


        installerContext.Status =
            InstallationStatus.Running;

        installerContext.ErrorMessage =
            null;


        // ------------------------------------------------------
        // MOVE TO INSTALLING PAGE
        // ------------------------------------------------------

        currentStep =
            pages.Count - 2;


        ShowCurrentPage();

        UpdateStepIndicator();


        try
        {
            InstallingPage? installingPage =
                pages[currentStep]
                as InstallingPage;


            if (installingPage == null)
            {
                throw new InvalidOperationException(
                    "Installing page could not be initialized.");
            }


            bool result =
                await installingPage.StartInstallAsync();


            // --------------------------------------------------
            // SUCCESS
            // --------------------------------------------------

            if (result &&
                installerContext.InstallationCompleted)
            {
                installationFinished =
                    true;


                currentStep =
                    pages.Count - 1;


                // Force final progress state.
                SetFooterProgress(
                    1f);


                pages[currentStep] =
                    new FinishPage(
                        installerContext);


                ShowCurrentPage();

                UpdateStepIndicator();

                return;
            }


            // --------------------------------------------------
            // FAILURE
            // --------------------------------------------------

            installerContext.Status =
                InstallationStatus.Failed;


            installationFinished =
                false;


            currentStep =
                pages.Count - 1;


            pages[currentStep] =
                new FinishPage(
                    installerContext);


            ShowCurrentPage();

            UpdateStepIndicator();
        }
        catch (Exception ex)
        {
            installerContext.Status =
                InstallationStatus.Failed;


            installerContext.ErrorMessage =
                ex.ToString();


            installationFinished =
                false;


            MessageBox.Show(
                "PCS installation failed."
                + Environment.NewLine
                + Environment.NewLine
                + ex.Message,
                "PCS Installer",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);


            currentStep =
                pages.Count - 1;


            pages[currentStep] =
                new FinishPage(
                    installerContext);


            ShowCurrentPage();

            UpdateStepIndicator();
        }
        finally
        {
            installationRunning =
                false;

            UpdateStepIndicator();
        }
    }


    // ==========================================================
    // SET FOOTER PROGRESS
    // ==========================================================

    private void SetFooterProgress(
        float progress)
    {
        if (progressTrack == null ||
            progressValue == null)
        {
            return;
        }


        progress =
            Math.Clamp(
                progress,
                0f,
                1f);


        int width =
            (int)(
                progressTrack.ClientSize.Width *
                progress);


        progressValue.Width =
            Math.Max(
                1,
                width);


        progressValue.Height =
            progressTrack.Height;
    }


    // ==========================================================
    // BACK
    // ==========================================================

    private void BtnBack_Click(
        object? sender,
        EventArgs e)
    {
        if (currentStep <= 0)
        {
            return;
        }


        if (installationRunning)
        {
            return;
        }


        if (installationFinished)
        {
            return;
        }


        currentStep--;


        ShowCurrentPage();

        UpdateStepIndicator();
    }


    // ==========================================================
    // CANCEL
    // ==========================================================

    private void BtnCancel_Click(
        object? sender,
        EventArgs e)
    {
        if (installationRunning)
        {
            return;
        }


        if (installationFinished)
        {
            return;
        }


        DialogResult result =
            MessageBox.Show(
                "Are you sure you want to cancel the PCS installation?",
                "PCS Installer",
                MessageBoxButtons.YesNo,
                MessageBoxIcon.Question);


        if (result ==
            DialogResult.Yes)
        {
            Close();
        }
    }
}