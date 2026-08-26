using PCS.Installer.Controls;
using PCS.Installer.Pages;
using PCS.Installer.Themes;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class WelcomePage : InstallerPageBase
{
    private Label eyebrowLabel = null!;
    private Label titleLabel = null!;
    private Label descriptionLabel = null!;

    private CardPanel featureCard = null!;
    private CardPanel requirementCard = null!;


    public WelcomePage()
    {
        PageTitle =
            "Welcome to PCS Installer";

        PageDescription =
            "Project Control Suite installation wizard";

        BuildContent();
    }


    private void BuildContent()
    {
        SuspendLayout();


        // =========================================================
        // HERO
        // =========================================================

        eyebrowLabel =
            new Label
            {
                Text =
                    "PROJECT CONTROL SUITE",

                Location =
                    new Point(
                        42,
                        34),

                Size =
                    new Size(
                        760,
                        24),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.Primary,

                BackColor =
                    Color.Transparent
            };


        titleLabel =
            new Label
            {
                Text =
                    "Welcome to PCS",

                Location =
                    new Point(
                        40,
                        62),

                Size =
                    new Size(
                        760,
                        48),

                Font =
                    Fonts.Header,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        descriptionLabel =
            new Label
            {
                Text =
                    "A professional platform for project control, " +
                    "cost management, planning and reporting.",

                Location =
                    new Point(
                        42,
                        112),

                Size =
                    new Size(
                        760,
                        48),

                Font =
                    Fonts.Body,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        // =========================================================
        // FEATURE CARD
        // =========================================================

        featureCard =
            new CardPanel
            {
                Location =
                    new Point(
                        40,
                        178),

                Size =
                    new Size(
                        800,
                        128)
            };


        Label featureTitle =
            new Label
            {
                Text =
                    "What PCS provides",

                Location =
                    new Point(
                        22,
                        18),

                Size =
                    new Size(
                        740,
                        28),

                Font =
                    Fonts.Header,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        Label featureText =
            new Label
            {
                Text =
                    "• Project Planning & PMS\r\n" +
                    "• Cost Control & EVM\r\n" +
                    "• Management Reporting & Analytics\r\n" +
                    "• Centralized project information",

                Location =
                    new Point(
                        24,
                        50),

                Size =
                    new Size(
                        740,
                        72),

                Font =
                    Fonts.Body,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        featureCard.Controls.Add(
            featureTitle);

        featureCard.Controls.Add(
            featureText);


        // =========================================================
        // REQUIREMENT CARD
        // =========================================================

        requirementCard =
            new CardPanel
            {
                Location =
                    new Point(
                        40,
                        330),

                Size =
                    new Size(
                        800,
                        128)
            };


        Label requirementTitle =
            new Label
            {
                Text =
                    "Before you begin",

                Location =
                    new Point(
                        22,
                        18),

                Size =
                    new Size(
                        740,
                        28),

                Font =
                    Fonts.Header,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        Label requirementText =
            new Label
            {
                Text =
                    "The installer will guide you through the required " +
                    "configuration steps. Your existing PCS data will not " +
                    "be modified unless you explicitly select an existing " +
                    "installation.",

                Location =
                    new Point(
                        24,
                        52),

                Size =
                    new Size(
                        740,
                        64),

                Font =
                    Fonts.Body,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        requirementCard.Controls.Add(
            requirementTitle);

        requirementCard.Controls.Add(
            requirementText);


        // =========================================================
        // VERSION / STATUS
        // =========================================================

        Label versionLabel =
            new Label
            {
                Text =
                    "PCS • Installation Wizard",

                Location =
                    new Point(
                        42,
                        486),

                Size =
                    new Size(
                        400,
                        24),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextMuted,

                BackColor =
                    Color.Transparent
            };


        // =========================================================
        // ADD CONTROLS
        // =========================================================

        Controls.Add(
            eyebrowLabel);

        Controls.Add(
            titleLabel);

        Controls.Add(
            descriptionLabel);

        Controls.Add(
            featureCard);

        Controls.Add(
            requirementCard);

        Controls.Add(
            versionLabel);


        ResumeLayout(
            false);
    }


    protected override void OnPaint(
        PaintEventArgs e)
    {
        base.OnPaint(e);


        e.Graphics.SmoothingMode =
            SmoothingMode.AntiAlias;


        Rectangle accent =
            new Rectangle(
                40,
                34,
                4,
                76);


        using SolidBrush brush =
            new SolidBrush(
                Colors.Primary);


        e.Graphics.FillRectangle(
            brush,
            accent);
    }
}