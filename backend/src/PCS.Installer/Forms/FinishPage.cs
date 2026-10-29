using PCS.Installer.Controls;
using PCS.Installer.Models;
using PCS.Installer.Pages;
using PCS.Installer.Themes;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class FinishPage
    : InstallerPageBase
{
    private readonly InstallerContext context;

    private Label statusIcon = null!;
    private Label messageLabel = null!;
    private Label detailLabel = null!;
    private Label locationLabel = null!;


    public FinishPage(
        InstallerContext context)
    {
        this.context = context;

        PageTitle =
            GetPageTitle();

        PageDescription =
            GetPageDescription();

        BuildContent();
    }


    private string GetPageTitle()
    {
        return context.InstallationCompleted
            ? "Installation Completed"
            : "Installation Failed";
    }


    private string GetPageDescription()
    {
        return context.InstallationCompleted
            ? "PCS is ready to use."
            : "PCS installation could not be completed.";
    }


    private void BuildContent()
    {
        SuspendLayout();

        bool success =
            context.InstallationCompleted;


        // =========================================================
        // RESULT CARD
        // =========================================================

        CardPanel resultCard =
            new CardPanel
            {
                Location =
                    new Point(
                        36,
                        48),

                Size =
                    new Size(
                        734,
                        270)
            };


        // =========================================================
        // STATUS ICON
        // =========================================================

        statusIcon =
            new Label
            {
                Text =
                    success
                        ? "✓"
                        : "!",

                Location =
                    new Point(
                        42,
                        42),

                Size =
                    new Size(
                        86,
                        86),

                Font =
                    new Font(
                        "Segoe UI",
                        38,
                        FontStyle.Bold),

                ForeColor =
                    success
                        ? Colors.Success
                        : Color.FromArgb(
                            190,
                            70,
                            70),

                BackColor =
                    success
                        ? Color.FromArgb(
                            239,
                            247,
                            242)
                        : Color.FromArgb(
                            252,
                            241,
                            241),

                TextAlign =
                    ContentAlignment.MiddleCenter
            };


        // =========================================================
        // MAIN MESSAGE
        // =========================================================

        messageLabel =
            new Label
            {
                Text =
                    success
                        ? "PCS has been installed successfully."
                        : "PCS installation failed.",

                Location =
                    new Point(
                        155,
                        48),

                Size =
                    new Size(
                        530,
                        36),

                Font =
                    Fonts.Header,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        // =========================================================
        // DETAIL
        // =========================================================

        detailLabel =
            new Label
            {
                Text =
                    success
                        ? "The installation process has completed successfully. " +
                          "You can now close this wizard and start using PCS."
                        : "The installation process could not be completed. " +
                          "Please review the installation log for more information.",

                Location =
                    new Point(
                        155,
                        92),

                Size =
                    new Size(
                        525,
                        70),

                Font =
                    Fonts.Body,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        // =========================================================
        // INSTALLATION LOCATION
        // =========================================================

        if (success)
        {
            Label locationTitle =
                new Label
                {
                    Text =
                        "Installed to",

                    Location =
                        new Point(
                            155,
                            170),

                    Size =
                        new Size(
                            120,
                            22),

                    Font =
                        Fonts.SmallBold,

                    ForeColor =
                        Colors.TextMuted,

                    BackColor =
                        Color.Transparent
                };


            locationLabel =
                new Label
                {
                    Text =
                        context.InstallPath,

                    Location =
                        new Point(
                            155,
                            194),

                    Size =
                        new Size(
                            525,
                            30),

                    Font =
                        Fonts.Small,

                    ForeColor =
                        Colors.TextPrimary,

                    BackColor =
                        Color.Transparent,

                    AutoEllipsis =
                        true
                };


            resultCard.Controls.Add(
                locationTitle);

            resultCard.Controls.Add(
                locationLabel);

            if (context.Mode == InstallationMode.NewInstall &&
                !string.IsNullOrWhiteSpace(context.InitialAdminPassword))
            {
                Label bootstrapPasswordLabel =
                    new Label
                    {
                        Text =
                            "One-time administrator password: " +
                            context.InitialAdminPassword,

                        Location =
                            new Point(155, 230),

                        Size =
                            new Size(525, 30),

                        Font =
                            Fonts.SmallBold,

                        ForeColor =
                            Colors.TextPrimary,

                        BackColor =
                            Color.Transparent,

                        AutoEllipsis =
                            true
                    };

                resultCard.Controls.Add(bootstrapPasswordLabel);

                detailLabel.Text =
                    "Save the one-time administrator password below. " +
                    "It is required for the first login; change it immediately.";
            }
        }


        resultCard.Controls.Add(
            statusIcon);

        resultCard.Controls.Add(
            messageLabel);

        resultCard.Controls.Add(
            detailLabel);


        // =========================================================
        // ERROR DETAILS
        // =========================================================

        if (!success &&
            !string.IsNullOrWhiteSpace(
                context.ErrorMessage))
        {
            CardPanel errorCard =
                new CardPanel
                {
                    Location =
                        new Point(
                            36,
                            335),

                    Size =
                        new Size(
                            734,
                            145)
                };


            Label errorTitle =
                new Label
                {
                    Text =
                        "Installation Error",

                    Location =
                        new Point(
                            20,
                            16),

                    Size =
                        new Size(
                            300,
                            24),

                    Font =
                        Fonts.SmallBold,

                    ForeColor =
                        Colors.TextPrimary,

                    BackColor =
                        Color.Transparent
                };


            TextBox errorBox =
                new TextBox
                {
                    Location =
                        new Point(
                            20,
                            48),

                    Size =
                        new Size(
                            690,
                            78),

                    Multiline =
                        true,

                    ReadOnly =
                        true,

                    ScrollBars =
                        ScrollBars.Vertical,

                    BorderStyle =
                        BorderStyle.FixedSingle,

                    BackColor =
                        Color.FromArgb(
                            248,
                            249,
                            251),

                    ForeColor =
                        Colors.TextSecondary,

                    Font =
                        Fonts.Small,

                    Text =
                        context.ErrorMessage
                };


            errorCard.Controls.Add(
                errorTitle);

            errorCard.Controls.Add(
                errorBox);

            Controls.Add(
                errorCard);
        }


        // =========================================================
        // SUCCESS NEXT STEP
        // =========================================================

        if (success)
        {
            Panel readyPanel =
                new Panel
                {
                    Location =
                        new Point(
                            36,
                            335),

                    Size =
                        new Size(
                            734,
                            70),

                    BackColor =
                        Color.FromArgb(
                            239,
                            247,
                            242)
                };


            Label readyLabel =
                new Label
                {
                    Text =
                        "✓  PCS is ready. Click Finish to close the installer.",

                    Location =
                        new Point(
                            20,
                            18),

                    Size =
                        new Size(
                            690,
                            32),

                    Font =
                        Fonts.Body,

                    ForeColor =
                        Colors.TextPrimary,

                    BackColor =
                        Color.Transparent,

                    TextAlign =
                        ContentAlignment.MiddleLeft
                };


            readyPanel.Controls.Add(
                readyLabel);

            Controls.Add(
                readyPanel);
        }


        Controls.Add(
            resultCard);

        ResumeLayout(false);
    }
}