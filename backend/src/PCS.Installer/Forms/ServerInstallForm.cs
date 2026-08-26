using PCS.Installer.Models;

namespace PCS.Installer.Forms;

public class ServerInstallForm : Form
{
    private TextBox installPathTextBox = null!;
    private TextBox serverNameTextBox = null!;
    private TextBox databaseNameTextBox = null!;
    private TextBox apiUrlTextBox = null!;

    private Button installButton = null!;

    private readonly InstallerContext context;

    public ServerInstallForm(
        InstallerContext context)
    {
        this.context = context;

        InitializeComponent();
    }

    private void InitializeComponent()
    {
        Text =
            "PCS Server Installation";

        Width =
            600;

        Height =
            450;

        StartPosition =
            FormStartPosition.CenterScreen;


        // ============================================================
        // Title
        // ============================================================

        var title = new Label
        {
            Text =
                "Server Configuration",

            Font =
                new Font(
                    "Segoe UI",
                    16,
                    FontStyle.Bold),

            Left = 40,

            Top = 30,

            AutoSize = true
        };


        // ============================================================
        // Installation Path
        // ============================================================

        var installLabel = new Label
        {
            Text =
                "Installation Path",

            Left = 40,

            Top = 100,

            Width = 150
        };


        installPathTextBox = new TextBox
        {
            Left = 220,

            Top = 95,

            Width = 300,

            Text =
                context.InstallPath
        };


        // ============================================================
        // Database Server
        // ============================================================

        var serverLabel = new Label
        {
            Text =
                "Server Name",

            Left = 40,

            Top = 150,

            Width = 150
        };


        serverNameTextBox = new TextBox
        {
            Left = 220,

            Top = 145,

            Width = 300,

            Text =
                context.DatabaseServer
        };


        // ============================================================
        // Database Name
        // ============================================================

        var dbLabel = new Label
        {
            Text =
                "Database Name",

            Left = 40,

            Top = 200,

            Width = 150
        };


        databaseNameTextBox = new TextBox
        {
            Left = 220,

            Top = 195,

            Width = 300,

            Text =
                context.DatabaseName
        };


        // ============================================================
        // API URL
        // ============================================================

        var apiLabel = new Label
        {
            Text =
                "API URL",

            Left = 40,

            Top = 250,

            Width = 150
        };


        apiUrlTextBox = new TextBox
        {
            Left = 220,

            Top = 245,

            Width = 300,

            Text =
                context.ApiUrl,

            PlaceholderText =
                "http://localhost:5000"
        };


        // ============================================================
        // Install Button
        // ============================================================

        installButton = new Button
        {
            Text =
                "Install PCS Server",

            Width =
                180,

            Height =
                40,

            Left =
                200,

            Top =
                330
        };


        installButton.Click +=
            InstallButton_Click;


        // ============================================================
        // Controls
        // ============================================================

        Controls.AddRange(
        [
            title,

            installLabel,
            installPathTextBox,

            serverLabel,
            serverNameTextBox,

            dbLabel,
            databaseNameTextBox,

            apiLabel,
            apiUrlTextBox,

            installButton
        ]);
    }

    private void InstallButton_Click(
        object? sender,
        EventArgs e)
    {
        // ============================================================
        // Validate Installation Path
        // ============================================================

        if (string.IsNullOrWhiteSpace(
            installPathTextBox.Text))
        {
            MessageBox.Show(
                "Please enter installation path.",
                "PCS Installer",
                MessageBoxButtons.OK,
                MessageBoxIcon.Warning);

            return;
        }


        // ============================================================
        // Validate Server Name
        // ============================================================

        if (string.IsNullOrWhiteSpace(
            serverNameTextBox.Text))
        {
            MessageBox.Show(
                "Please enter server name.",
                "PCS Installer",
                MessageBoxButtons.OK,
                MessageBoxIcon.Warning);

            return;
        }


        // ============================================================
        // Validate Database Name
        // ============================================================

        if (string.IsNullOrWhiteSpace(
            databaseNameTextBox.Text))
        {
            MessageBox.Show(
                "Please enter database name.",
                "PCS Installer",
                MessageBoxButtons.OK,
                MessageBoxIcon.Warning);

            return;
        }


        // ============================================================
        // Validate API URL
        // ============================================================

        string apiUrl =
            apiUrlTextBox.Text.Trim();

        if (string.IsNullOrWhiteSpace(apiUrl))
        {
            MessageBox.Show(
                "Please enter API URL.",
                "PCS Installer",
                MessageBoxButtons.OK,
                MessageBoxIcon.Warning);

            return;
        }


        if (!Uri.TryCreate(
                apiUrl,
                UriKind.Absolute,
                out Uri? parsedUri) ||
            (parsedUri.Scheme != Uri.UriSchemeHttp &&
             parsedUri.Scheme != Uri.UriSchemeHttps))
        {
            MessageBox.Show(
                "Please enter a valid HTTP or HTTPS API URL.\n\n" +
                "Example:\n" +
                "http://localhost:5000",
                "PCS Installer",
                MessageBoxButtons.OK,
                MessageBoxIcon.Warning);

            return;
        }


        // ============================================================
        // Update Installer Context
        // ============================================================

        context.InstallPath =
            installPathTextBox.Text.Trim();

        context.DatabaseServer =
            serverNameTextBox.Text.Trim();

        context.DatabaseName =
            databaseNameTextBox.Text.Trim();

        context.ApiUrl =
            apiUrl;


        // ============================================================
        // Start Installation
        // ============================================================

        Hide();


        var progressForm =
            new InstallationProgressForm(
                context);


        progressForm.FormClosed +=
            (s, args) =>
            {
                Close();
            };


        progressForm.ShowDialog();
    }
}