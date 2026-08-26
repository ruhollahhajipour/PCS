using PCS.Installer.Controls;
using PCS.Installer.Models;
using PCS.Installer.Pages;
using PCS.Installer.Themes;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class SummaryPage : InstallerPageBase
{
    private readonly InstallerContext context;

    private Label editionValue = null!;
    private Label installationTypeValue = null!;
    private Label installPathValue = null!;
    private Label databaseTypeValue = null!;
    private Label databaseServerValue = null!;
    private Label databaseNameValue = null!;
    private Label authenticationValue = null!;


    public SummaryPage(
        InstallerContext context)
    {
        this.context = context;

        PageTitle =
            "Installation Summary";

        PageDescription =
            "Review your PCS configuration before starting the installation.";

        BuildContent();
    }


    private void BuildContent()
    {
        SuspendLayout();

        // =========================================================
        // INTRO
        // =========================================================

        Label introLabel =
            new Label
            {
                Text =
                    "Everything is ready. Please review the configuration below.",

                Location =
                    new Point(
                        36,
                        24),

                Size =
                    new Size(
                        720,
                        28),

                Font =
                    Fonts.Body,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        // =========================================================
        // EDITION CARD
        // =========================================================

        CardPanel editionCard =
            CreateCard(
                new Point(36, 70),
                new Size(360, 92));

        AddCardTitle(
            editionCard,
            "PCS Edition");

        editionValue =
            AddValueLabel(
                editionCard,
                GetEditionText(),
                48);


        // =========================================================
        // INSTALLATION TYPE CARD
        // =========================================================

        CardPanel installationCard =
            CreateCard(
                new Point(410, 70),
                new Size(360, 92));

        AddCardTitle(
            installationCard,
            "Installation Type");

        installationTypeValue =
            AddValueLabel(
                installationCard,
                GetInstallationTypeText(),
                48);


        // =========================================================
        // INSTALLATION LOCATION
        // =========================================================

        CardPanel locationCard =
            CreateCard(
                new Point(36, 178),
                new Size(734, 92));

        AddCardTitle(
            locationCard,
            "Installation Location");

        installPathValue =
            AddValueLabel(
                locationCard,
                context.InstallPath,
                48);


        // =========================================================
        // DATABASE CARD
        // =========================================================

        CardPanel databaseCard =
            CreateCard(
                new Point(36, 286),
                new Size(734, 164));

        AddCardTitle(
            databaseCard,
            "Database Configuration");


        AddField(
            databaseCard,
            "Type",
            GetDatabaseTypeText(),
            24,
            48,
            out databaseTypeValue);


        AddField(
            databaseCard,
            "Server",
            context.DatabaseServer,
            250,
            48,
            out databaseServerValue);


        AddField(
            databaseCard,
            "Database",
            context.DatabaseName,
            500,
            48,
            out databaseNameValue);


        AddField(
            databaseCard,
            "Authentication",
            GetAuthenticationText(),
            24,
            104,
            out authenticationValue);


        // =========================================================
        // READY MESSAGE
        // =========================================================

        Panel readyPanel =
            new Panel
            {
                Location =
                    new Point(
                        36,
                        466),

                Size =
                    new Size(
                        734,
                        54),

                BackColor =
                    Color.FromArgb(
                        239,
                        247,
                        242)
            };


        Label readyIcon =
            new Label
            {
                Text = "✓",

                Location =
                    new Point(
                        16,
                        10),

                Size =
                    new Size(
                        30,
                        30),

                Font =
                    new Font(
                        "Segoe UI",
                        14,
                        FontStyle.Bold),

                ForeColor =
                    Colors.Success,

                BackColor =
                    Color.Transparent,

                TextAlign =
                    ContentAlignment.MiddleCenter
            };


        Label readyLabel =
            new Label
            {
                Text =
                    "Ready to install PCS. Click Next to begin.",

                Location =
                    new Point(
                        52,
                        12),

                Size =
                    new Size(
                        650,
                        28),

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
            readyIcon);

        readyPanel.Controls.Add(
            readyLabel);


        Controls.Add(introLabel);
        Controls.Add(editionCard);
        Controls.Add(installationCard);
        Controls.Add(locationCard);
        Controls.Add(databaseCard);
        Controls.Add(readyPanel);

        ResumeLayout(false);
    }


    private CardPanel CreateCard(
        Point location,
        Size size)
    {
        return new CardPanel
        {
            Location = location,
            Size = size
        };
    }


    private void AddCardTitle(
        CardPanel card,
        string text)
    {
        Label label =
            new Label
            {
                Text = text,

                Location =
                    new Point(
                        20,
                        14),

                Size =
                    new Size(
                        card.Width - 40,
                        24),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };

        card.Controls.Add(label);
    }


    private Label AddValueLabel(
        CardPanel card,
        string text,
        int top)
    {
        Label label =
            new Label
            {
                Text =
                    text,

                Location =
                    new Point(
                        20,
                        top),

                Size =
                    new Size(
                        card.Width - 40,
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

        card.Controls.Add(label);

        return label;
    }


    private void AddField(
        CardPanel card,
        string title,
        string value,
        int left,
        int top,
        out Label valueLabel)
    {
        Label titleLabel =
            new Label
            {
                Text =
                    title,

                Location =
                    new Point(
                        left,
                        top),

                Size =
                    new Size(
                        190,
                        20),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextMuted,

                BackColor =
                    Color.Transparent
            };


        valueLabel =
            new Label
            {
                Text =
                    string.IsNullOrWhiteSpace(value)
                        ? "-"
                        : value,

                Location =
                    new Point(
                        left,
                        top + 21),

                Size =
                    new Size(
                        210,
                        26),

                Font =
                    Fonts.Body,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent,

                AutoEllipsis =
                    true
            };


        card.Controls.Add(titleLabel);
        card.Controls.Add(valueLabel);
    }


    private string GetEditionText()
    {
        return context.Edition ==
               ProductEdition.Professional
            ? "PCS Professional"
            : "PCS Free";
    }


    private string GetInstallationTypeText()
    {
        return context.InstallationType ==
               InstallationType.Server
            ? "PCS Server"
            : "PCS Client";
    }


    private string GetDatabaseTypeText()
    {
        return context.DatabaseType ==
               DatabaseType.SqlServer
            ? "SQL Server"
            : "SQLite";
    }


    private string GetAuthenticationText()
    {
        if (context.DatabaseType ==
            DatabaseType.SQLite)
        {
            return "Local SQLite";
        }

        return context.WindowsAuthentication
            ? "Windows Authentication"
            : "SQL Authentication";
    }
}