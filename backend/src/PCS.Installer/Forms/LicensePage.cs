using PCS.Installer.Controls;
using PCS.Installer.Models;
using PCS.Installer.Pages;
using PCS.Installer.Themes;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class LicensePage : InstallerPageBase
{
    private readonly InstallerContext context;

    private RadioButton freeRadio = null!;
    private RadioButton proRadio = null!;

    private TextBox licenseBox = null!;
    private TextBox companyBox = null!;

    private CardPanel freeCard = null!;
    private CardPanel proCard = null!;

    public LicensePage(
        InstallerContext context)
    {
        this.context = context;

        PageTitle =
            "Choose PCS Edition";

        PageDescription =
            "Select the edition that best fits your project requirements.";

        BuildContent();
    }


    private void BuildContent()
    {
        SuspendLayout();

        // =========================================================
        // FREE CARD
        // =========================================================

        freeCard =
            new CardPanel
            {
                Location =
                    new Point(
                        40,
                        42),

                Size =
                    new Size(
                        330,
                        190),

                Cursor =
                    Cursors.Hand
            };


        Label freeBadge =
            new Label
            {
                Text =
                    "STANDARD",

                Location =
                    new Point(
                        22,
                        18),

                Size =
                    new Size(
                        120,
                        22),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.Primary,

                BackColor =
                    Color.Transparent
            };


        Label freeTitle =
            new Label
            {
                Text =
                    "PCS Free",

                Location =
                    new Point(
                        22,
                        45),

                Size =
                    new Size(
                        260,
                        34),

                Font =
                    Fonts.Header,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        Label freeDescription =
            new Label
            {
                Text =
                    "Essential project control tools for " +
                    "individual and small project teams.",

                Location =
                    new Point(
                        22,
                        82),

                Size =
                    new Size(
                        280,
                        42),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        Label freeFeatures =
            new Label
            {
                Text =
                    "✓ PMS & Planning\r\n" +
                    "✓ Basic Reports\r\n" +
                    "✓ Project Templates",

                Location =
                    new Point(
                        22,
                        130),

                Size =
                    new Size(
                        260,
                        54),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        freeRadio =
            new RadioButton
            {
                Location =
                    new Point(
                        292,
                        20),

                Size =
                    new Size(
                        24,
                        24),

                Checked =
                    context.Edition ==
                    ProductEdition.Free
            };


        freeCard.Controls.Add(freeBadge);
        freeCard.Controls.Add(freeTitle);
        freeCard.Controls.Add(freeDescription);
        freeCard.Controls.Add(freeFeatures);
        freeCard.Controls.Add(freeRadio);


        // =========================================================
        // PROFESSIONAL CARD
        // =========================================================

        proCard =
            new CardPanel
            {
                Location =
                    new Point(
                        390,
                        42),

                Size =
                    new Size(
                        330,
                        190),

                Cursor =
                    Cursors.Hand
            };


        Label proBadge =
            new Label
            {
                Text =
                    "PROFESSIONAL",

                Location =
                    new Point(
                        22,
                        18),

                Size =
                    new Size(
                        160,
                        22),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.Success,

                BackColor =
                    Color.Transparent
            };


        Label proTitle =
            new Label
            {
                Text =
                    "PCS Professional",

                Location =
                    new Point(
                        22,
                        45),

                Size =
                    new Size(
                        260,
                        34),

                Font =
                    Fonts.Header,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        Label proDescription =
            new Label
            {
                Text =
                    "Advanced enterprise capabilities for " +
                    "professional project environments.",

                Location =
                    new Point(
                        22,
                        82),

                Size =
                    new Size(
                        280,
                        42),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        Label proFeatures =
            new Label
            {
                Text =
                    "✓ Cost Control & EVM\r\n" +
                    "✓ Advanced Reporting\r\n" +
                    "✓ Multi User & Scheduling",

                Location =
                    new Point(
                        22,
                        130),

                Size =
                    new Size(
                        270,
                        54),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        proRadio =
            new RadioButton
            {
                Location =
                    new Point(
                        292,
                        20),

                Size =
                    new Size(
                        24,
                        24),

                Checked =
                    context.Edition ==
                    ProductEdition.Professional
            };


        proCard.Controls.Add(proBadge);
        proCard.Controls.Add(proTitle);
        proCard.Controls.Add(proDescription);
        proCard.Controls.Add(proFeatures);
        proCard.Controls.Add(proRadio);


        // =========================================================
        // PROFESSIONAL LICENSE SECTION
        // =========================================================

        CardPanel licenseCard =
            new CardPanel
            {
                Location =
                    new Point(
                        40,
                        250),

                Size =
                    new Size(
                        680,
                        185)
            };


        Label licenseTitle =
            new Label
            {
                Text =
                    "Professional License",

                Location =
                    new Point(
                        22,
                        18),

                Size =
                    new Size(
                        300,
                        28),

                Font =
                    Fonts.Header,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        Label licenseDescription =
            new Label
            {
                Text =
                    "Required only when Professional Edition is selected.",

                Location =
                    new Point(
                        22,
                        48),

                Size =
                    new Size(
                        550,
                        24),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        Label companyLabel =
            new Label
            {
                Text =
                    "Company Name",

                Location =
                    new Point(
                        22,
                        84),

                Size =
                    new Size(
                        180,
                        22),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        companyBox =
            new TextBox
            {
                Location =
                    new Point(
                        22,
                        108),

                Width =
                    280,

                Height =
                    28,

                Enabled =
                    false,

                Text =
                    context.CompanyName
            };


        Label licenseLabel =
            new Label
            {
                Text =
                    "License Key",

                Location =
                    new Point(
                        330,
                        84),

                Size =
                    new Size(
                        180,
                        22),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        licenseBox =
            new TextBox
            {
                Location =
                    new Point(
                        330,
                        108),

                Width =
                    320,

                Height =
                    28,

                Enabled =
                    false,

                Text =
                    context.LicenseKey
            };


        licenseCard.Controls.Add(licenseTitle);
        licenseCard.Controls.Add(licenseDescription);
        licenseCard.Controls.Add(companyLabel);
        licenseCard.Controls.Add(companyBox);
        licenseCard.Controls.Add(licenseLabel);
        licenseCard.Controls.Add(licenseBox);


        // =========================================================
        // EVENTS
        // =========================================================

        freeRadio.CheckedChanged +=
            EditionChanged;

        proRadio.CheckedChanged +=
            EditionChanged;


        freeCard.Click +=
            (_, _) =>
            {
                freeRadio.Checked = true;
            };

        proCard.Click +=
            (_, _) =>
            {
                proRadio.Checked = true;
            };


        // =========================================================
        // ADD CONTROLS
        // =========================================================

        Controls.Add(freeCard);
        Controls.Add(proCard);
        Controls.Add(licenseCard);

        UpdateEditionUI();

        ResumeLayout(false);
    }


    private void EditionChanged(
        object? sender,
        EventArgs e)
    {
        if (freeRadio == null ||
            proRadio == null)
        {
            return;
        }

        bool professional =
            proRadio.Checked;

        context.Edition =
            professional
                ? ProductEdition.Professional
                : ProductEdition.Free;

        companyBox.Enabled =
            professional;

        licenseBox.Enabled =
            professional;

        if (!professional)
        {
            companyBox.Text =
                string.Empty;

            licenseBox.Text =
                string.Empty;
        }

        UpdateEditionUI();
    }


    private void UpdateEditionUI()
    {
        if (freeCard == null ||
            proCard == null)
        {
            return;
        }

        freeCard.Invalidate();
        proCard.Invalidate();

        if (proRadio != null &&
            licenseBox != null &&
            companyBox != null)
        {
            bool professional =
                proRadio.Checked;

            companyBox.Enabled =
                professional;

            licenseBox.Enabled =
                professional;
        }
    }


    public bool ValidatePage()
    {
        if (context.Edition ==
            ProductEdition.Professional)
        {
            if (string.IsNullOrWhiteSpace(
                licenseBox.Text))
            {
                MessageBox.Show(
                    "Please enter the Professional license key.",
                    "PCS License",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Warning);

                licenseBox.Focus();

                return false;
            }

            context.LicenseKey =
                licenseBox.Text.Trim();

            context.CompanyName =
                companyBox.Text.Trim();
        }

        context.LicenseAccepted =
            true;

        return true;
    }
}