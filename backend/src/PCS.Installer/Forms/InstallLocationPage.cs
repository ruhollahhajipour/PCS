using PCS.Installer.Models;
using PCS.Installer.Pages;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class InstallLocationPage : InstallerPageBase
{
    private readonly InstallerContext context;

    private TextBox pathBox = null!;

    private Button browseButton = null!;


    public InstallLocationPage(
        InstallerContext context)
    {
        this.context = context;


        PageTitle =
            "Installation Location";


        PageDescription =
            "Choose where PCS will be installed.";


        BuildContent();
    }




    private void BuildContent()
    {
        Label label = new Label
        {
            Text = "Installation Folder:",
            Location = new Point(40,90),
            AutoSize = true,
            Font = new Font(
                "Segoe UI",
                10)
        };


        pathBox = new TextBox
        {
            Location =
                new Point(40,130),

            Width = 450,

            Text =
                string.IsNullOrWhiteSpace(
                    context.InstallPath)

                ? @"C:\PCS"

                : context.InstallPath
        };



        browseButton = new Button
        {
            Text = "Browse",

            Location =
                new Point(510,128),

            Width = 100,

            Height = 30
        };


        browseButton.Click +=
            BrowseButton_Click;



        pathBox.TextChanged +=
            (s,e)=>
            {
                context.InstallPath =
                    pathBox.Text;
            };



        Controls.Add(label);

        Controls.Add(pathBox);

        Controls.Add(browseButton);



        context.InstallPath =
            pathBox.Text;
    }





    private void BrowseButton_Click(
        object? sender,
        EventArgs e)
    {
        using FolderBrowserDialog dialog =
            new();


        dialog.Description =
            "Select PCS installation folder";


        dialog.SelectedPath =
            pathBox.Text;



        if(dialog.ShowDialog()==DialogResult.OK)
        {
            pathBox.Text =
                dialog.SelectedPath;
        }
    }
}