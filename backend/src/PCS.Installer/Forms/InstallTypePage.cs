using PCS.Installer.Models;
using PCS.Installer.Pages;
using PCS.Installer.Controls;
using PCS.Installer.Themes;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class InstallTypePage : InstallerPageBase
{
    private readonly InstallerContext context;


    private RadioButton serverRadio = null!;

    private RadioButton clientRadio = null!;



    public InstallTypePage(
        InstallerContext context)
    {
        this.context = context;


        PageTitle =
            "Installation Type";


        PageDescription =
            "Select the type of PCS installation.";


        BuildContent();
    }





    private void BuildContent()
    {

        CardPanel card = new()
        {
            Location =
                new Point(50,50),

            Size =
                new Size(650,280)
        };




        Label title = new()
        {
            Text =
                "Choose installation mode:",

            Location =
                new Point(25,25),

            AutoSize = true,

            Font =
                Fonts.Header,

            ForeColor =
                Colors.TextPrimary
        };





        serverRadio = new RadioButton
        {
            Text =
                "Server Installation\n" +
                "Install PCS Backend, Database and Services",

            Location =
                new Point(35,80),

            AutoSize = true,

            Checked =
                context.InstallationType ==
                InstallationType.Server
        };




        clientRadio = new RadioButton
        {
            Text =
                "Client Installation\n" +
                "Install PCS Client application only",

            Location =
                new Point(35,150),

            AutoSize = true,

            Checked =
                context.InstallationType ==
                InstallationType.Client
        };





        serverRadio.CheckedChanged +=
            (s,e) =>
            {
                if(serverRadio.Checked)
                {
                    context.InstallationType =
                        InstallationType.Server;
                }
            };





        clientRadio.CheckedChanged +=
            (s,e) =>
            {
                if(clientRadio.Checked)
                {
                    context.InstallationType =
                        InstallationType.Client;
                }
            };





        card.Controls.Add(title);

        card.Controls.Add(serverRadio);

        card.Controls.Add(clientRadio);



        Controls.Add(card);
    }
}