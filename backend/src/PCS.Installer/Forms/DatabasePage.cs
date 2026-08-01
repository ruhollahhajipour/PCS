using PCS.Installer.Models;
using PCS.Installer.Pages;
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

    private TextBox usernameBox = null!;

    private TextBox passwordBox = null!;



    public DatabasePage(
        InstallerContext context)
    {
        this.context = context;


        PageTitle =
            "Database Configuration";


        PageDescription =
            "Configure PCS database settings.";


        BuildContent();
    }






    private void BuildContent()
    {
        Label typeLabel = new()
        {
            Text = "Database Type:",
            Location = new Point(40, 80),
            AutoSize = true
        };


        databaseTypeBox = new ComboBox
        {
            Location = new Point(200, 75),
            Width = 250,
            DropDownStyle = ComboBoxStyle.DropDownList
        };


        databaseTypeBox.Items.Add("SQL Server");
        databaseTypeBox.Items.Add("SQLite");


        databaseTypeBox.SelectedIndex =
            context.DatabaseType == DatabaseType.SQLite
            ? 1
            : 0;



        Label serverLabel = new()
        {
            Text = "Server:",
            Location = new Point(40, 130),
            AutoSize = true
        };


        serverBox = new TextBox
        {
            Location = new Point(200, 125),
            Width = 300,
            Text = context.DatabaseServer
        };




        Label databaseLabel = new()
        {
            Text = "Database Name:",
            Location = new Point(40, 180),
            AutoSize = true
        };


        databaseNameBox = new TextBox
        {
            Location = new Point(200, 175),
            Width = 300,

            Text =
                string.IsNullOrWhiteSpace(
                    context.DatabaseName)

                ? "PCS"

                : context.DatabaseName
        };





        windowsAuthBox = new CheckBox
        {
            Text = "Windows Authentication",

            Location =
                new Point(200,225),

            AutoSize = true,

            Checked =
                context.WindowsAuthentication
        };





        Label usernameLabel = new()
        {
            Text = "Username:",
            Location = new Point(40,275),
            AutoSize = true
        };


        usernameBox = new TextBox
        {
            Location = new Point(200,270),
            Width = 300,
            Text = context.Username
        };





        Label passwordLabel = new()
        {
            Text = "Password:",
            Location = new Point(40,325),
            AutoSize = true
        };


        passwordBox = new TextBox
        {
            Location = new Point(200,320),
            Width = 300,
            PasswordChar = '*',
            Text = context.Password
        };





        databaseTypeBox.SelectedIndexChanged +=
            (s,e) =>
            {
                context.DatabaseType =
                    databaseTypeBox.SelectedIndex == 1

                    ? DatabaseType.SQLite

                    : DatabaseType.SqlServer;
            };




        serverBox.TextChanged +=
            (s,e) =>
            {
                context.DatabaseServer =
                    serverBox.Text;
            };




        databaseNameBox.TextChanged +=
            (s,e) =>
            {
                context.DatabaseName =
                    databaseNameBox.Text;
            };




        windowsAuthBox.CheckedChanged +=
            (s,e) =>
            {
                context.WindowsAuthentication =
                    windowsAuthBox.Checked;
            };




        usernameBox.TextChanged +=
            (s,e) =>
            {
                context.Username =
                    usernameBox.Text;
            };




        passwordBox.TextChanged +=
            (s,e) =>
            {
                context.Password =
                    passwordBox.Text;
            };





        Controls.Add(typeLabel);

        Controls.Add(databaseTypeBox);

        Controls.Add(serverLabel);

        Controls.Add(serverBox);

        Controls.Add(databaseLabel);

        Controls.Add(databaseNameBox);

        Controls.Add(windowsAuthBox);

        Controls.Add(usernameLabel);

        Controls.Add(usernameBox);

        Controls.Add(passwordLabel);

        Controls.Add(passwordBox);




        context.DatabaseType =
            databaseTypeBox.SelectedIndex == 1

            ? DatabaseType.SQLite

            : DatabaseType.SqlServer;


        context.DatabaseName =
            databaseNameBox.Text;
    }
}