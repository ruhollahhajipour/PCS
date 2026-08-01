using PCS.Installer.Services.Packaging;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class BuildReleaseForm : Form
{
    private TextBox solutionBox = null!;
    private TextBox frontendBox = null!;
    private TextBox releaseBox = null!;

    private Button buildButton = null!;

    private ProgressBar progressBar = null!;

    private TextBox logBox = null!;


    public BuildReleaseForm()
    {
        InitializeComponent();
    }



    private void InitializeComponent()
    {
        Text = "PCS Release Builder";

        Width = 750;
        Height = 600;

        StartPosition =
            FormStartPosition.CenterScreen;



        Label solutionLabel =
            new()
            {
                Text = "Backend Solution:",
                Left = 30,
                Top = 30,
                Width = 150
            };


        solutionBox =
            new TextBox
            {
                Left = 190,
                Top = 25,
                Width = 480,
                Text =
                    @"D:\Projects\PCS\backend"
            };



        Label frontendLabel =
            new()
            {
                Text = "Frontend Root:",
                Left = 30,
                Top = 75,
                Width = 150
            };


        frontendBox =
            new TextBox
            {
                Left = 190,
                Top = 70,
                Width = 480,
                Text =
                    @"D:\Projects\PCS\frontend"
            };



        Label releaseLabel =
            new()
            {
                Text = "Release Folder:",
                Left = 30,
                Top = 120,
                Width = 150
            };


        releaseBox =
            new TextBox
            {
                Left = 190,
                Top = 115,
                Width = 480,
                Text =
                    @"D:\Projects\PCS\Release"
            };



        buildButton =
            new Button
            {
                Text = "Build Release",
                Left = 280,
                Top = 165,
                Width = 180,
                Height = 40
            };


        buildButton.Click +=
            BuildButton_Click;



        progressBar =
            new ProgressBar
            {
                Left = 30,
                Top = 230,
                Width = 640,
                Height = 25,
                Minimum = 0,
                Maximum = 100
            };



        logBox =
            new TextBox
            {
                Left = 30,
                Top = 280,
                Width = 640,
                Height = 220,

                Multiline = true,
                ScrollBars =
                    ScrollBars.Vertical,

                ReadOnly = true
            };



        Controls.Add(solutionLabel);
        Controls.Add(solutionBox);

        Controls.Add(frontendLabel);
        Controls.Add(frontendBox);

        Controls.Add(releaseLabel);
        Controls.Add(releaseBox);

        Controls.Add(buildButton);

        Controls.Add(progressBar);

        Controls.Add(logBox);
    }




    private async void BuildButton_Click(
        object? sender,
        EventArgs e)
    {
        try
        {
            buildButton.Enabled = false;

            logBox.AppendText(
                "Starting release build...\r\n");


            var builder =
                new PackageBuilder();



            progressBar.Value = 10;


            string package =
                await builder.BuildAsync(
                    solutionBox.Text,
                    frontendBox.Text,
                    releaseBox.Text);



            progressBar.Value = 100;


            logBox.AppendText(
                "\r\nRelease created:\r\n");


            logBox.AppendText(
                package);



            MessageBox.Show(
                "Release package created successfully.",
                "PCS Builder",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);
        }
        catch(Exception ex)
        {
            MessageBox.Show(
                ex.Message,
                "Build Error",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);
        }
        finally
        {
            buildButton.Enabled = true;
        }
    }
}