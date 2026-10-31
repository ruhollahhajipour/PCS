using PCS.Installer.Controls;
using PCS.Installer.Models;
using PCS.Installer.Pages;
using PCS.Installer.Themes;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class DatabasePage : InstallerPageBase
{
    private readonly InstallerContext context;

    private ComboBox databaseTypeBox = null!;
    private TextBox serverBox = null!;
    private TextBox databaseNameBox = null!;

    private CheckBox windowsAuthBox = null!;

    private Label usernameLabel = null!;
    private TextBox usernameBox = null!;

    private Label passwordLabel = null!;
    private TextBox passwordBox = null!;

    private Label authenticationHint = null!;


    public DatabasePage(
        InstallerContext context)
    {
        this.context = context;

        /*
         * SQL Server uses Windows Authentication
         * by default when no explicit SQL credentials
         * have been configured.
         */
        if (context.DatabaseType == DatabaseType.SqlServer &&
            string.IsNullOrWhiteSpace(context.Username) &&
            string.IsNullOrWhiteSpace(context.Password))
        {
            context.WindowsAuthentication = true;
        }

        PageTitle =
            "Database Configuration";

        PageDescription =
            "Configure the database used by PCS.";

        BuildContent();

        UpdateAuthenticationControls();
    }


    private void BuildContent()
    {
        SuspendLayout();

        // =========================================================
        // DATABASE CARD
        // =========================================================

        CardPanel databaseCard =
            new CardPanel
            {
                Location =
                    new Point(
                        40,
                        35),

                Size =
                    new Size(
                        680,
                        350)
            };


        // =========================================================
        // CARD TITLE
        // =========================================================

        Label titleLabel =
            new Label
            {
                Text =
                    "Database Settings",

                Location =
                    new Point(
                        24,
                        20),

                Size =
                    new Size(
                        400,
                        30),

                Font =
                    Fonts.Header,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        Label descriptionLabel =
            new Label
            {
                Text =
                    "Select the database engine and provide the required connection details.",

                Location =
                    new Point(
                        24,
                        53),

                Size =
                    new Size(
                        610,
                        25),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        // =========================================================
        // DATABASE TYPE
        // =========================================================

        Label typeLabel =
            new Label
            {
                Text =
                    "Database Type",

                Location =
                    new Point(
                        24,
                        92),

                Size =
                    new Size(
                        150,
                        22),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        databaseTypeBox =
            new ComboBox
            {
                Location =
                    new Point(
                        190,
                        88),

                Size =
                    new Size(
                        300,
                        32),

                DropDownStyle =
                    ComboBoxStyle.DropDownList,

                Font =
                    Fonts.Body
            };


        databaseTypeBox.Items.Add(
            "SQL Server");

        databaseTypeBox.Items.Add(
            "SQLite");


        databaseTypeBox.SelectedIndex =
            context.DatabaseType ==
            DatabaseType.SQLite
                ? 1
                : 0;


        // =========================================================
        // SERVER
        // =========================================================

        Label serverLabel =
            new Label
            {
                Text =
                    "Server",

                Location =
                    new Point(
                        24,
                        140),

                Size =
                    new Size(
                        150,
                        22),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        serverBox =
            new TextBox
            {
                Location =
                    new Point(
                        190,
                        136),

                Size =
                    new Size(
                        300,
                        32),

                Font =
                    Fonts.Body,

                Text =
                    string.IsNullOrWhiteSpace(
                        context.DatabaseServer)
                        ? "localhost"
                        : context.DatabaseServer
            };


        // =========================================================
        // DATABASE NAME
        // =========================================================

        Label databaseLabel =
            new Label
            {
                Text =
                    "Database Name",

                Location =
                    new Point(
                        24,
                        188),

                Size =
                    new Size(
                        150,
                        22),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        databaseNameBox =
            new TextBox
            {
                Location =
                    new Point(
                        190,
                        184),

                Size =
                    new Size(
                        300,
                        32),

                Font =
                    Fonts.Body,

                Text =
                    string.IsNullOrWhiteSpace(
                        context.DatabaseName)
                        ? "PCS"
                        : context.DatabaseName
            };


        // =========================================================
        // AUTHENTICATION
        // =========================================================

        Label authenticationLabel =
            new Label
            {
                Text =
                    "Authentication",

                Location =
                    new Point(
                        24,
                        236),

                Size =
                    new Size(
                        150,
                        22),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        windowsAuthBox =
            new CheckBox
            {
                Text =
                    "Windows Authentication",

                Location =
                    new Point(
                        190,
                        232),

                AutoSize =
                    true,

                Font =
                    Fonts.Body,

                ForeColor =
                    Colors.TextPrimary,

                Checked =
                    context.WindowsAuthentication
            };


        authenticationHint =
            new Label
            {
                Text =
                    "Use your current Windows account to connect to SQL Server.",

                Location =
                    new Point(
                        190,
                        258),

                Size =
                    new Size(
                        450,
                        22),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        // =========================================================
        // USERNAME
        // =========================================================

        usernameLabel =
            new Label
            {
                Text =
                    "Username",

                Location =
                    new Point(
                        24,
                        292),

                Size =
                    new Size(
                        150,
                        22),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        usernameBox =
            new TextBox
            {
                Location =
                    new Point(
                        190,
                        288),

                Size =
                    new Size(
                        300,
                        32),

                Font =
                    Fonts.Body,

                Text =
                    context.Username
            };


        // =========================================================
        // PASSWORD
        // =========================================================

        passwordLabel =
            new Label
            {
                Text =
                    "Password",

                Location =
                    new Point(
                        24,
                        336),

                Size =
                    new Size(
                        150,
                        22),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        passwordBox =
            new TextBox
            {
                Location =
                    new Point(
                        190,
                        332),

                Size =
                    new Size(
                        300,
                        32),

                Font =
                    Fonts.Body,

                UseSystemPasswordChar =
                    true,

                Text =
                    context.Password
            };


        // =========================================================
        // EVENTS
        // =========================================================

        databaseTypeBox.SelectedIndexChanged +=
            (_, _) =>
            {
                context.DatabaseType =
                    databaseTypeBox.SelectedIndex == 1
                        ? DatabaseType.SQLite
                        : DatabaseType.SqlServer;

                UpdateAuthenticationControls();
            };


        serverBox.TextChanged +=
            (_, _) =>
            {
                context.DatabaseServer =
                    serverBox.Text.Trim();
            };


        databaseNameBox.TextChanged +=
            (_, _) =>
            {
                context.DatabaseName =
                    databaseNameBox.Text.Trim();
            };


        windowsAuthBox.CheckedChanged +=
            (_, _) =>
            {
                context.WindowsAuthentication =
                    windowsAuthBox.Checked;

                UpdateAuthenticationControls();
            };


        usernameBox.TextChanged +=
            (_, _) =>
            {
                context.Username =
                    usernameBox.Text;
            };


        passwordBox.TextChanged +=
            (_, _) =>
            {
                context.Password =
                    passwordBox.Text;
            };


        // =========================================================
        // ADD CONTROLS
        // =========================================================

        databaseCard.Controls.Add(titleLabel);
        databaseCard.Controls.Add(descriptionLabel);

        databaseCard.Controls.Add(typeLabel);
        databaseCard.Controls.Add(databaseTypeBox);

        databaseCard.Controls.Add(serverLabel);
        databaseCard.Controls.Add(serverBox);

        databaseCard.Controls.Add(databaseLabel);
        databaseCard.Controls.Add(databaseNameBox);

        databaseCard.Controls.Add(authenticationLabel);
        databaseCard.Controls.Add(windowsAuthBox);
        databaseCard.Controls.Add(authenticationHint);

        databaseCard.Controls.Add(usernameLabel);
        databaseCard.Controls.Add(usernameBox);

        databaseCard.Controls.Add(passwordLabel);
        databaseCard.Controls.Add(passwordBox);


        // =========================================================
        // INFORMATION CARD
        // =========================================================

        CardPanel infoCard =
            new CardPanel
            {
                Location =
                    new Point(
                        40,
                        405),

                Size =
                    new Size(
                        680,
                        80)
            };


        Label infoLabel =
            new Label
            {
                Text =
                    "Tip: Windows Authentication is recommended for local SQL Server installations. " +
                    "SQLite requires no server or login credentials.",

                Location =
                    new Point(
                        24,
                        18),

                Size =
                    new Size(
                        630,
                        44),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        infoCard.Controls.Add(infoLabel);


        Controls.Add(databaseCard);
        Controls.Add(infoCard);


        // =========================================================
        // INITIAL CONTEXT
        // =========================================================

        context.DatabaseType =
            databaseTypeBox.SelectedIndex == 1
                ? DatabaseType.SQLite
                : DatabaseType.SqlServer;

        context.DatabaseServer =
            serverBox.Text.Trim();

        context.DatabaseName =
            databaseNameBox.Text.Trim();

        context.WindowsAuthentication =
            windowsAuthBox.Checked;


        ResumeLayout(false);
    }


    private void UpdateAuthenticationControls()
    {
        if (databaseTypeBox == null ||
            windowsAuthBox == null)
        {
            return;
        }


        bool isSqlServer =
            context.DatabaseType ==
            DatabaseType.SqlServer;


        bool useWindowsAuthentication =
            context.WindowsAuthentication;


        // =========================================================
        // SQL SERVER
        // =========================================================

        windowsAuthBox.Enabled =
            isSqlServer;


        if (!isSqlServer)
        {
            windowsAuthBox.Checked =
                false;

            usernameLabel.Enabled =
                false;

            usernameBox.Enabled =
                false;

            passwordLabel.Enabled =
                false;

            passwordBox.Enabled =
                false;

            authenticationHint.Text =
                "SQLite does not require authentication credentials.";

            authenticationHint.ForeColor =
                Colors.TextSecondary;

            return;
        }


        // =========================================================
        // WINDOWS AUTHENTICATION
        // =========================================================

        usernameLabel.Enabled =
            !useWindowsAuthentication;

        usernameBox.Enabled =
            !useWindowsAuthentication;

        passwordLabel.Enabled =
            !useWindowsAuthentication;

        passwordBox.Enabled =
            !useWindowsAuthentication;


        if (useWindowsAuthentication)
        {
            authenticationHint.Text =
                "✓ Windows account authentication is enabled.";

            authenticationHint.ForeColor =
                Colors.Success;
        }
        else
        {
            authenticationHint.Text =
                "Enter SQL Server username and password.";

            authenticationHint.ForeColor =
                Colors.TextSecondary;
        }
    }
}