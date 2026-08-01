using PCS.Installer.Models;
using PCS.Installer.Services;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class InstallationProgressForm : Form
{
    private ProgressBar progressBar = null!;

    private Label statusLabel = null!;

    private Button closeButton = null!;


    private readonly InstallerContext context;



    public InstallationProgressForm(
        InstallerContext context)
    {
        this.context = context;

        InitializeComponent();

        Shown += InstallationProgressForm_Shown;
    }



    private void InitializeComponent()
    {
        Text =
            "PCS Installation Progress";


        Width =
            600;


        Height =
            250;


        StartPosition =
            FormStartPosition.CenterScreen;



        statusLabel = new Label
        {
            Text =
                "Preparing installation...",

            Left =
                40,

            Top =
                40,

            Width =
                500,

            Height =
                30
        };



        progressBar = new ProgressBar
        {
            Left =
                40,

            Top =
                90,

            Width =
                500,

            Height =
                30,

            Minimum =
                0,

            Maximum =
                100
        };



        closeButton = new Button
        {
            Text =
                "Close",

            Width =
                120,

            Height =
                40,

            Left =
                230,

            Top =
                150,

            Enabled =
                false
        };



        closeButton.Click +=
            (s, e) =>
            {
                Close();
            };



        Controls.Add(statusLabel);

        Controls.Add(progressBar);

        Controls.Add(closeButton);
    }





    private async void InstallationProgressForm_Shown(
        object? sender,
        EventArgs e)
    {
        try
        {
            InstallerService service =
                new InstallerService(context);



            Progress<string> progress =
                new(message =>
                {
                    if (!IsDisposed)
                    {
                        statusLabel.Text =
                            message;


                        // نمایش تقریبی پیشرفت
                        if (message.Contains("Validating"))
                            progressBar.Value = 5;

                        else if (message.Contains("folders"))
                            progressBar.Value = 10;

                        else if (message.Contains("configuration"))
                            progressBar.Value = 25;

                        else if (message.Contains("API"))
                            progressBar.Value = 45;

                        else if (message.Contains("Frontend"))
                            progressBar.Value = 65;

                        else if (message.Contains("database"))
                            progressBar.Value = 85;

                        else if (message.Contains("Windows Service"))
                            progressBar.Value = 95;

                        else if (message.Contains("completed"))
                            progressBar.Value = 100;
                    }
                });



            await service.InstallAsync(
                progress);



            statusLabel.Text =
                "PCS installation completed successfully.";


            progressBar.Value =
                100;


            closeButton.Enabled =
                true;



            MessageBox.Show(
                "PCS installation completed successfully.",
                "PCS Installer",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);
        }
        catch(Exception ex)
        {
            MessageBox.Show(
                ex.Message,
                "Installation Error",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);

            Close();
        }
    }
}