using PCS.Installer.Pages;
using PCS.Installer.Controls;
using PCS.Installer.Themes;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class WelcomePage : InstallerPageBase
{
    private Label welcomeTitle = null!;

    private Label descriptionLabel = null!;

    private PictureBox logoBox = null!;


    public WelcomePage()
    {
        PageTitle =
            "Welcome to PCS Installer";


        PageDescription =
            "Project Control Suite installation wizard";


        BuildContent();
    }





    private void BuildContent()
    {
        logoBox = new PictureBox
        {
            Size =
                new Size(120,120),

            Location =
                new Point(40,40),

            SizeMode =
                PictureBoxSizeMode.Zoom,

            BackColor =
                Color.Transparent
        };



        welcomeTitle = new Label
        {
            Text =
                "Welcome to Project Control Suite",

            Location =
                new Point(200,55),

            AutoSize = true,

            Font =
                Fonts.Header,

            ForeColor =
                Colors.TextPrimary
        };




        descriptionLabel = new Label
        {
            Text =
                "This wizard will guide you through the installation of PCS.\n\n" +
                "PCS provides project control, cost management,\n" +
                "reporting and operational monitoring capabilities.",


            Location =
                new Point(200,110),


            Size =
                new Size(500,100),


            Font =
                Fonts.Body,


            ForeColor =
                Colors.TextSecondary
        };





        CardPanel infoCard = new()
        {
            Location =
                new Point(40,220),

            Size =
                new Size(650,140)
        };



        Label infoLabel = new()
        {
            Text =
                "Before starting installation:\n\n" +
                "• Make sure you have administrator privileges\n" +
                "• Prepare database configuration details\n" +
                "• Close other running PCS components",


            Location =
                new Point(20,20),

            AutoSize = true,

            Font =
                Fonts.Body,

            ForeColor =
                Colors.TextPrimary
        };



        infoCard.Controls.Add(infoLabel);



        Controls.Add(logoBox);

        Controls.Add(welcomeTitle);

        Controls.Add(descriptionLabel);

        Controls.Add(infoCard);
    }
}