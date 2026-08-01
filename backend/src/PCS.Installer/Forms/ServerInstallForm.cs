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

            Width = 300
        };







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

        if(string.IsNullOrWhiteSpace(
            installPathTextBox.Text))
        {

            MessageBox.Show(
                "Please enter installation path.");

            return;
        }




        if(string.IsNullOrWhiteSpace(
            serverNameTextBox.Text))
        {

            MessageBox.Show(
                "Please enter server name.");

            return;
        }




        if(string.IsNullOrWhiteSpace(
            databaseNameTextBox.Text))
        {

            MessageBox.Show(
                "Please enter database name.");

            return;
        }






        context.InstallPath =
            installPathTextBox.Text.Trim();



        context.DatabaseServer =
            serverNameTextBox.Text.Trim();



        context.DatabaseName =
            databaseNameTextBox.Text.Trim();





        Hide();




        var progressForm =
            new InstallationProgressForm(
                context);




        progressForm.FormClosed +=
            (s,args)=>
            {
                Close();
            };



        progressForm.ShowDialog();

    }

}