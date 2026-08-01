using PCS.Installer.Models;
using PCS.Installer.Pages;
using PCS.Installer.Services;
using PCS.Installer.Themes;
using System.Drawing;
using System.Windows.Forms;


namespace PCS.Installer.Forms;


public class InstallingPage : InstallerPageBase
{
    private readonly InstallerService installerService;


    private ProgressBar progressBar = null!;

    private Label statusLabel = null!;

    private Label percentLabel = null!;

    private TextBox logBox = null!;



    public InstallingPage(
        InstallerContext context)
    {
        installerService =
            new InstallerService(context);


        PageTitle =
            "Installing PCS";


        PageDescription =
            "PCS installation is in progress.";


        BuildContent();
    }





    private void BuildContent()
    {

        progressBar =
            new ProgressBar
            {
                Location =
                    new Point(40, 90),

                Size =
                    new Size(650, 30),

                Minimum = 0,

                Maximum = 100,

                Value = 0
            };



        percentLabel =
            new Label
            {
                Location =
                    new Point(700, 90),

                Size =
                    new Size(80, 30),

                Font =
                    Fonts.Body,

                Text =
                    "0%"
            };



        statusLabel =
            new Label
            {
                Location =
                    new Point(40, 140),

                Size =
                    new Size(650, 30),

                Font =
                    Fonts.Body,

                Text =
                    "Preparing installation..."
            };



        logBox =
            new TextBox
            {
                Location =
                    new Point(40, 190),

                Size =
                    new Size(650, 220),

                Multiline = true,

                ReadOnly = true,

                ScrollBars =
                    ScrollBars.Vertical
            };



        Controls.Add(progressBar);

        Controls.Add(percentLabel);

        Controls.Add(statusLabel);

        Controls.Add(logBox);
    }








    public async Task<bool> StartInstallAsync()
    {
        try
        {
            progressBar.Value = 0;

            percentLabel.Text = "0%";


            var messageProgress =
                new Progress<string>(
                    message =>
                    {
                        statusLabel.Text =
                            message;


                        logBox.AppendText(
                            $"{DateTime.Now:HH:mm:ss} - {message}{Environment.NewLine}");
                    });



            var percentProgress =
                new Progress<int>(
                    percent =>
                    {

                        if(percent < 0)
                            percent = 0;


                        if(percent > 100)
                            percent = 100;



                        progressBar.Value =
                            percent;



                        percentLabel.Text =
                            $"{percent}%";
                    });





            await installerService.InstallAsync(
                messageProgress,
                percentProgress);





            progressBar.Value =
                100;


            percentLabel.Text =
                "100%";



            statusLabel.Text =
                "Installation completed successfully.";



            logBox.AppendText(
                $"{DateTime.Now:HH:mm:ss} - Installation completed successfully.{Environment.NewLine}");



            return true;
        }
        catch(Exception ex)
        {

            statusLabel.Text =
                "Installation failed.";



            logBox.AppendText(
                $"{Environment.NewLine}{ex.Message}");



            MessageBox.Show(
                ex.Message,
                "PCS Installer Error",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);



            return false;
        }
    }
}