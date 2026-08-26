using System.Diagnostics;
using System.Net.Sockets;

namespace PCS.Launcher;

internal static class Program
{
    private const int ApiPort = 5000;

    private const string ApiUrl =
        "http://localhost:5000";

    private const string ApiExecutableName =
        "PCS.API.exe";

    [STAThread]
    private static void Main()
    {
        ApplicationConfiguration.Initialize();

        try
        {
            string localAppData =
                Environment.GetFolderPath(
                    Environment.SpecialFolder.LocalApplicationData);

            string pcsPath =
                Path.Combine(
                    localAppData,
                    "PCS");

            string backendPath =
                Path.Combine(
                    pcsPath,
                    "Backend");

            string apiExecutable =
                Path.Combine(
                    backendPath,
                    ApiExecutableName);

            if (!File.Exists(apiExecutable))
            {
                ShowError(
                    "PCS API executable was not found."
                    + Environment.NewLine
                    + Environment.NewLine
                    + "Expected location:"
                    + Environment.NewLine
                    + apiExecutable);

                return;
            }

            if (!IsApiRunning())
            {
                StartApi(
                    apiExecutable,
                    backendPath);
            }

            if (!WaitForApi())
            {
                ShowError(
                    "PCS could not start the API."
                    + Environment.NewLine
                    + Environment.NewLine
                    + "Please check the PCS logs in:"
                    + Environment.NewLine
                    + Path.Combine(
                        pcsPath,
                        "Logs"));

                return;
            }

            Application.Run(
                new MainForm());
        }
        catch (Exception ex)
        {
            ShowError(
                "PCS could not be started."
                + Environment.NewLine
                + Environment.NewLine
                + ex.Message);
        }
    }

    private static bool IsApiRunning()
    {
        try
        {
            using TcpClient client =
                new();

            IAsyncResult result =
                client.BeginConnect(
                    "127.0.0.1",
                    ApiPort,
                    null,
                    null);

            bool connected =
                result.AsyncWaitHandle.WaitOne(
                    TimeSpan.FromMilliseconds(500));

            if (!connected)
            {
                return false;
            }

            try
            {
                client.EndConnect(result);
            }
            catch
            {
                return false;
            }

            return client.Connected;
        }
        catch
        {
            return false;
        }
    }

    private static void StartApi(
        string apiExecutable,
        string workingDirectory)
    {
        ProcessStartInfo startInfo =
            new()
            {
                FileName =
                    apiExecutable,

                Arguments =
                    $"--urls \"{ApiUrl}\"",

                WorkingDirectory =
                    workingDirectory,

                UseShellExecute =
                    false,

                CreateNoWindow =
                    true,

                WindowStyle =
                    ProcessWindowStyle.Hidden
            };

        Process.Start(startInfo);
    }

    private static bool WaitForApi()
    {
        const int attempts = 30;

        for (int i = 0; i < attempts; i++)
        {
            if (IsApiRunning())
            {
                return true;
            }

            Thread.Sleep(500);
        }

        return false;
    }

    private static void ShowError(
        string message)
    {
        MessageBox.Show(
            message,
            "PCS",
            MessageBoxButtons.OK,
            MessageBoxIcon.Error);
    }
}