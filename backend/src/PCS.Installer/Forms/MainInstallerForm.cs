using PCS.Installer.Controls;
using PCS.Installer.Models;
using PCS.Installer.Forms;
using System.Drawing;
using System.Windows.Forms;


namespace PCS.Installer.Forms;


public class MainInstallerForm : Form
{

    private WizardHeader header = null!;

    private StepIndicator stepIndicator = null!;

    private Panel contentPanel = null!;


    private Button btnBack = null!;

    private Button btnNext = null!;

    private Button btnCancel = null!;



    private readonly List<UserControl> pages = new();


    private readonly InstallerContext installerContext = new();


    private int currentStep = 0;


    private bool installationRunning = false;


    private bool installationFinished = false;



    public MainInstallerForm()
    {
        BuildUI();

        InitializePages();

        ShowCurrentPage();

        UpdateStepIndicator();
    }






    private void BuildUI()
    {

        Text = "PCS Installer";

        Width = 900;

        Height = 620;

        StartPosition =
            FormStartPosition.CenterScreen;

        BackColor = Color.White;



        header =
            new WizardHeader
            {
                Title =
                    "Project Control Suite",

                Description =
                    "PCS Installation Wizard"
            };



        stepIndicator =
            new StepIndicator();



        contentPanel =
            new Panel
            {
                Dock =
                    DockStyle.Fill,

                Padding =
                    new Padding(30),

                BackColor =
                    Color.White
            };



        Panel footer =
            new Panel
            {
                Dock =
                    DockStyle.Bottom,

                Height = 70,

                BackColor =
                    Color.White
            };



        btnBack =
            new Button
            {
                Text = "< Back",

                Width = 100,

                Height = 40,

                Location =
                    new Point(520,15)
            };



        btnNext =
            new Button
            {
                Text = "Next >",

                Width = 100,

                Height = 40,

                Location =
                    new Point(630,15)
            };



        btnCancel =
            new Button
            {
                Text = "Cancel",

                Width = 100,

                Height = 40,

                Location =
                    new Point(740,15)
            };



        btnBack.Click += BtnBack_Click;

        btnNext.Click += BtnNext_Click;

        btnCancel.Click += BtnCancel_Click;



        footer.Controls.Add(btnBack);

        footer.Controls.Add(btnNext);

        footer.Controls.Add(btnCancel);



        Controls.Add(contentPanel);

        Controls.Add(footer);

        Controls.Add(stepIndicator);

        Controls.Add(header);

    }







    private void InitializePages()
    {

        pages.Clear();



        pages.Add(
            new WelcomePage());



        pages.Add(
            new LicensePage(
                installerContext));



        pages.Add(
            new InstallTypePage(
                installerContext));



        pages.Add(
            new InstallLocationPage(
                installerContext));



        pages.Add(
            new DatabasePage(
                installerContext));



        pages.Add(
            new SummaryPage(
                installerContext));



        pages.Add(
            new InstallingPage(
                installerContext));



        pages.Add(
            new FinishPage(
                installerContext));

    }








    private void ShowCurrentPage()
    {

        contentPanel.Controls.Clear();



        UserControl page =
            pages[currentStep];



        page.Dock =
            DockStyle.Fill;



        contentPanel.Controls.Add(page);

    }








    private void UpdateStepIndicator()
    {

        stepIndicator.CurrentStep =
            currentStep;


        stepIndicator.Invalidate();



        btnBack.Enabled =
            currentStep > 0
            &&
            !installationRunning
            &&
            !installationFinished;



        if(currentStep ==
            pages.Count - 1)
        {

            btnNext.Text =
                "Finish";


            btnNext.Enabled =
                true;


            btnCancel.Enabled =
                false;


            return;
        }



        if(currentStep ==
            pages.Count - 2)
        {

            btnNext.Text =
                "Install";


            btnNext.Enabled =
                !installationRunning;


            return;
        }



        btnNext.Text =
            "Next >";


        btnNext.Enabled =
            !installationRunning;

    }








    private async void BtnNext_Click(
        object? sender,
        EventArgs e)
    {

        if(installationRunning)
            return;



        if(currentStep ==
            pages.Count - 1)
        {
            Close();

            return;
        }






        if(currentStep ==
            pages.Count - 2)
        {

            installationRunning = true;


            btnNext.Enabled = false;

            btnBack.Enabled = false;

            btnCancel.Enabled = false;



            currentStep++;


            ShowCurrentPage();

            UpdateStepIndicator();




            try
            {

                InstallingPage? page =
                    pages[currentStep]
                    as InstallingPage;



                if(page != null)
                {
                    await page.StartInstallAsync();
                }




                if(installerContext.InstallationCompleted)
                {

                    installationFinished = true;


                    currentStep =
                        pages.Count - 1;


                    pages[currentStep] =
                        new FinishPage(
                            installerContext);



                    ShowCurrentPage();

                }
                else
                {

                    MessageBox.Show(
                        "Installation failed.",
                        "PCS Installer",
                        MessageBoxButtons.OK,
                        MessageBoxIcon.Error);



                    currentStep--;

                    ShowCurrentPage();

                }

            }
            catch(Exception ex)
            {

                MessageBox.Show(
                    ex.Message,
                    "PCS Installer",
                    MessageBoxButtons.OK,
                    MessageBoxIcon.Error);



                currentStep--;

                ShowCurrentPage();

            }



            installationRunning = false;


            UpdateStepIndicator();


            return;

        }






        currentStep++;


        ShowCurrentPage();


        UpdateStepIndicator();

    }








    private void BtnBack_Click(
        object? sender,
        EventArgs e)
    {

        if(currentStep <= 0)
            return;



        currentStep--;


        ShowCurrentPage();


        UpdateStepIndicator();

    }








    private void BtnCancel_Click(
        object? sender,
        EventArgs e)
    {

        if(installationRunning)
            return;



        if(MessageBox.Show(
            "Cancel installation?",
            "PCS Installer",
            MessageBoxButtons.YesNo,
            MessageBoxIcon.Question)
            == DialogResult.Yes)
        {
            Close();
        }

    }

}