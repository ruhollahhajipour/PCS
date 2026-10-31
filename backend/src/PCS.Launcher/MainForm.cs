using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace PCS.Launcher;

public sealed class MainForm : Form
{
    private readonly WebView2 webView;

    private const string PcsUrl =
        "http://localhost:5000";

    public MainForm()
    {
        Text = "PCS - Project Control Suite";

        StartPosition = FormStartPosition.CenterScreen;

        Width = 1440;
        Height = 900;

        MinimumSize = new Size(1100, 700);

        BackColor = Color.White;

        FormBorderStyle = FormBorderStyle.Sizable;

        webView = new WebView2
        {
            Dock = DockStyle.Fill
        };

        Controls.Add(webView);

        Load += MainForm_Load;

        FormClosed += MainForm_FormClosed;
    }

    private async void MainForm_Load(
        object? sender,
        EventArgs e)
    {
        try
        {
            await webView.EnsureCoreWebView2Async();

            webView.CoreWebView2.Settings.AreDefaultContextMenusEnabled =
                true;

            webView.CoreWebView2.Settings.AreDevToolsEnabled =
                false;

            webView.CoreWebView2.Settings.IsStatusBarEnabled =
                false;

            webView.CoreWebView2.Settings.AreBrowserAcceleratorKeysEnabled =
                true;

            webView.CoreWebView2.NavigationStarting +=
                CoreWebView2_NavigationStarting;

            webView.CoreWebView2.NavigationCompleted +=
                CoreWebView2_NavigationCompleted;

            webView.CoreWebView2.Navigate(PcsUrl);
        }
        catch (Exception ex)
        {
            MessageBox.Show(
                "PCS interface could not be loaded."
                + Environment.NewLine
                + Environment.NewLine
                + ex.Message,
                "PCS",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);

            Close();
        }
    }

    private void CoreWebView2_NavigationStarting(
        object? sender,
        CoreWebView2NavigationStartingEventArgs e)
    {
        if (!e.Uri.StartsWith(
                "http://localhost:5000",
                StringComparison.OrdinalIgnoreCase))
        {
            e.Cancel = true;
        }
    }

    private void CoreWebView2_NavigationCompleted(
        object? sender,
        CoreWebView2NavigationCompletedEventArgs e)
    {
        if (!e.IsSuccess)
        {
            MessageBox.Show(
                "PCS could not load the application interface."
                + Environment.NewLine
                + Environment.NewLine
                + $"Navigation error: {e.WebErrorStatus}",
                "PCS",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);
        }
    }

    private void MainForm_FormClosed(
        object? sender,
        FormClosedEventArgs e)
    {
        webView.Dispose();
    }
}