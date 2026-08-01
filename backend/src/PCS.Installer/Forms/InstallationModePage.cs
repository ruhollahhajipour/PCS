using PCS.Installer.Models;
using PCS.Installer.Pages;
using PCS.Installer.Controls;
using PCS.Installer.Themes;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class InstallationModePage : InstallerPageBase
{
    private readonly InstallerContext context;


    private RadioButton newInstallRadio = null!;
    private RadioButton repairRadio = null!;
    private RadioButton upgradeRadio = null!;
    private RadioButton uninstallRadio = null!;



    public InstallationModePage(
        InstallerContext context)
    {
        this.context = context;


        PageTitle =
            "Installation Mode";


        PageDescription =
            "Choose what you want to do with PCS.";


        BuildContent();
    }





    private void BuildContent()
    {
        CardPanel card = new()
        {
            Location =
                new Point(50,50),

            Size =
                new Size(650,350)
        };



        Label title = new()
        {
            Text =
                "Select operation:",

            Location =
                new Point(25,25),

            AutoSize = true,

            Font =
                Fonts.Header,

            ForeColor =
                Colors.TextPrimary
        };



        newInstallRadio = CreateRadio(
            "New Installation",
            InstallationMode.NewInstall,
            80);



        repairRadio = CreateRadio(
            "Repair existing installation",
            InstallationMode.Repair,
            140);



        upgradeRadio = CreateRadio(
            "Upgrade PCS",
            InstallationMode.Upgrade,
            200);



        uninstallRadio = CreateRadio(
            "Uninstall PCS",
            InstallationMode.Uninstall,
            260);



        card.Controls.Add(title);

        card.Controls.Add(newInstallRadio);

        card.Controls.Add(repairRadio);

        card.Controls.Add(upgradeRadio);

        card.Controls.Add(uninstallRadio);



        Controls.Add(card);
    }





    private RadioButton CreateRadio(
        string text,
        InstallationMode mode,
        int y)
    {
        RadioButton radio = new()
        {
            Text = text,

            Location =
                new Point(35,y),

            AutoSize = true,

            Checked =
                context.Mode == mode
        };


        radio.CheckedChanged +=
            (s,e)=>
            {
                if(radio.Checked)
                {
                    context.Mode = mode;
                }
            };


        return radio;
    }
}