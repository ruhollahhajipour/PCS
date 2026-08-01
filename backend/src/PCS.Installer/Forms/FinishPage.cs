using PCS.Installer.Models;
using PCS.Installer.Pages;
using PCS.Installer.Themes;
using System.Drawing;
using System.Windows.Forms;


namespace PCS.Installer.Forms;


public class FinishPage : InstallerPageBase
{

    private readonly InstallerContext context;


    private Label titleLabel = null!;

    private Label messageLabel = null!;

    private Label detailLabel = null!;



    public FinishPage(
        InstallerContext context)
    {
        this.context = context;


        PageTitle =
            "Installation Completed";


        PageDescription =
            "PCS installation finished.";


        BuildContent();
    }





    private void BuildContent()
    {

        titleLabel =
            new Label
            {
                Text =
                    "PCS Installation Completed",


                Location =
                    new Point(50, 70),


                AutoSize = true,


                Font =
                    new Font(
                        Fonts.Body.FontFamily,
                        20,
                        FontStyle.Bold)
            };





        messageLabel =
            new Label
            {
                Text =
                    context.InstallationCompleted

                    ?

                    "PCS has been installed successfully."

                    :

                    "PCS installation failed.",



                Location =
                    new Point(50, 130),


                AutoSize = true,


                Font =
                    Fonts.Body
            };






        detailLabel =
            new Label
            {
                Text =
                    context.InstallationCompleted

                    ?

                    "You can now close this wizard and start using PCS."

                    :

                    "Please review installation logs and try again.",



                Location =
                    new Point(50, 180),


                AutoSize = true,


                ForeColor =
                    Color.Gray,


                Font =
                    Fonts.Body
            };




        Controls.Add(titleLabel);

        Controls.Add(messageLabel);

        Controls.Add(detailLabel);
    }

}