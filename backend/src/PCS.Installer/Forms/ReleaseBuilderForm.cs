using PCS.Installer.Services.Packaging;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class ReleaseBuilderForm : Form
{
    private TextBox solutionBox = null!;

    private TextBox frontendBox = null!;

    private TextBox outputBox = null!;

    private Button buildButton = null!;

    private ProgressBar progressBar = null!;

    private TextBox logBox = null!;



    public ReleaseBuilderForm()
    {
        BuildUI();
    }







    private void BuildUI()
    {
        Text =
            "PCS Release Builder";


        Width =
            700;


        Height =
            550;


        StartPosition =
            FormStartPosition.CenterParent;



        Label title =
            new Label
            {
                Text =
                    "Create PCS Installation Package",

                Location =
                    new Point(30,30),

                AutoSize =
                    true,

                Font =
                    new Font(
                        "Segoe UI",
                        16,
                        FontStyle.Bold)
            };



        solutionBox =
            CreateTextBox(
                "Backend Solution Path",
                80);



        frontendBox =
            CreateTextBox(
                "Frontend Path",
                140);



        outputBox =
            CreateTextBox(
                "Release Output Path",
                200);





        buildButton =
            new Button
            {
                Text =
                    "Build Release",

                Location =
                    new Point(30,260),

                Width =
                    150,

                Height =
                    40
            };



        buildButton.Click +=
            BuildButton_Click;




        progressBar =
            new ProgressBar
            {
                Location =
                    new Point(30,320),

                Width =
                    620,

                Height =
                    30
            };





        logBox =
            new TextBox
            {
                Location =
                    new Point(30,370),

                Width =
                    620,

                Height =
                    100,

                Multiline =
                    true,

                ReadOnly =
                    true,

                ScrollBars =
                    ScrollBars.Vertical
            };



        Controls.Add(title);

        Controls.Add(solutionBox);

        Controls.Add(frontendBox);

        Controls.Add(outputBox);

        Controls.Add(buildButton);

        Controls.Add(progressBar);

        Controls.Add(logBox);
    }









    private TextBox CreateTextBox(
        string text,
        int top)
    {

        TextBox box =
            new TextBox
            {
                Location =
                    new Point(30,top),

                Width =
                    620,

                Text =
                    text
            };


        return box;
    }









    private async void BuildButton_Click(
        object? sender,
        EventArgs e)
    {

        try
        {

            buildButton.Enabled =
                false;


            logBox.AppendText(
                "Building PCS release...\r\n");



            progressBar.Value =
                20;



            PackageBuilder builder =
                new PackageBuilder();



            string zip =
                await builder.BuildAsync(
                    solutionBox.Text,
                    frontendBox.Text,
                    outputBox.Text);



            progressBar.Value =
                100;



            logBox.AppendText(
                $"Release created:\r\n{zip}");



            MessageBox.Show(
                "PCS release created successfully.",
                "Release Builder",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information);

        }
        catch(Exception ex)
        {

            MessageBox.Show(
                ex.Message,
                "Release Error",
                MessageBoxButtons.OK,
                MessageBoxIcon.Error);

        }
        finally
        {
            buildButton.Enabled =
                true;
        }
    }
}