using PCS.Installer.Models;
using PCS.Installer.Pages;
using PCS.Installer.Controls;
using PCS.Installer.Themes;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Forms;


public class LicensePage : InstallerPageBase
{
    private readonly InstallerContext context;


    private RichTextBox licenseBox = null!;

    private CheckBox acceptBox = null!;



    public bool Accepted =>
        acceptBox.Checked;



    public LicensePage(
        InstallerContext context)
    {
        this.context = context;


        PageTitle =
            "License Agreement";


        PageDescription =
            "Please read and accept the license agreement before continuing.";


        BuildContent();
    }






    private void BuildContent()
    {

        CardPanel card = new()
        {
            Location =
                new Point(40,40),

            Size =
                new Size(700,350)
        };



        licenseBox = new RichTextBox
        {
            Location =
                new Point(20,20),

            Size =
                new Size(660,250),

            ReadOnly = true,

            BorderStyle =
                BorderStyle.FixedSingle,

            BackColor =
                Color.White,

            Font =
                Fonts.Body
        };



        licenseBox.Text =
@"Project Control Suite (PCS)

Software License Agreement

This software is provided for authorized company use only.

By installing PCS you agree that:

• The software will be used according to company policies.
• Configuration files must not be modified without authorization.
• Database access must follow security requirements.

Copyright © PCS";



        acceptBox = new CheckBox
        {
            Text =
                "I accept the terms of this license agreement.",

            Location =
                new Point(20,290),

            AutoSize = true,

            Font =
                Fonts.Body
        };



        acceptBox.CheckedChanged +=
            (s,e)=>
            {
                context.LicenseAccepted =
                    acceptBox.Checked;
            };



        card.Controls.Add(licenseBox);

        card.Controls.Add(acceptBox);


        Controls.Add(card);
    }
}