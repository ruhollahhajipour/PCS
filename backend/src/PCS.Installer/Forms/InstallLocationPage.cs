using PCS.Installer.Controls;
using PCS.Installer.Models;
using PCS.Installer.Pages;
using PCS.Installer.Themes;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class InstallLocationPage : InstallerPageBase
{
    private readonly InstallerContext context;

    private TextBox pathBox = null!;
    private SecondaryButton browseButton = null!;
    private Label pathStatusLabel = null!;


    public InstallLocationPage(
        InstallerContext context)
    {
        this.context = context;

        PageTitle =
            "Installation Location";

        PageDescription =
            "Choose where PCS will be installed on this computer.";

        BuildContent();
    }


    private void BuildContent()
    {
        SuspendLayout();

        // =========================================================
        // MAIN CARD
        // =========================================================

        CardPanel locationCard =
            new CardPanel
            {
                Location =
                    new Point(
                        40,
                        45),

                Size =
                    new Size(
                        680,
                        220)
            };


        // =========================================================
        // TITLE
        // =========================================================

        Label titleLabel =
            new Label
            {
                Text =
                    "PCS Installation Folder",

                Location =
                    new Point(
                        24,
                        22),

                Size =
                    new Size(
                        500,
                        30),

                Font =
                    Fonts.Header,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        // =========================================================
        // DESCRIPTION
        // =========================================================

        Label descriptionLabel =
            new Label
            {
                Text =
                    "Select the folder where PCS application files " +
                    "and local configuration will be stored.",

                Location =
                    new Point(
                        24,
                        58),

                Size =
                    new Size(
                        610,
                        32),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        // =========================================================
        // PATH LABEL
        // =========================================================

        Label pathLabel =
            new Label
            {
                Text =
                    "Installation path",

                Location =
                    new Point(
                        24,
                        104),

                Size =
                    new Size(
                        180,
                        22),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        // =========================================================
        // PATH BOX
        // =========================================================

        pathBox =
            new TextBox
            {
                Location =
                    new Point(
                        24,
                        132),

                Size =
                    new Size(
                        490,
                        34),

                Font =
                    Fonts.Body,

                Text =
                    context.InstallPath,

                BorderStyle =
                    BorderStyle.FixedSingle
            };


        // =========================================================
        // BROWSE BUTTON
        // =========================================================

        browseButton =
            new SecondaryButton
            {
                Text =
                    "Browse",

                Location =
                    new Point(
                        528,
                        128),

                Width =
                    110,

                Height =
                    42
            };


        // =========================================================
        // PATH STATUS
        // =========================================================

        pathStatusLabel =
            new Label
            {
                Location =
                    new Point(
                        24,
                        174),

                Size =
                    new Size(
                        610,
                        24),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.Success,

                BackColor =
                    Color.Transparent,

                Text =
                    "✓ This location can be used without administrator privileges."
            };


        // =========================================================
        // EVENTS
        // =========================================================

        browseButton.Click +=
            BrowseButton_Click;


        pathBox.TextChanged +=
            PathBox_TextChanged;


        // =========================================================
        // ADD CARD CONTENT
        // =========================================================

        locationCard.Controls.Add(titleLabel);
        locationCard.Controls.Add(descriptionLabel);
        locationCard.Controls.Add(pathLabel);
        locationCard.Controls.Add(pathBox);
        locationCard.Controls.Add(browseButton);
        locationCard.Controls.Add(pathStatusLabel);


        // =========================================================
        // INFORMATION CARD
        // =========================================================

        CardPanel infoCard =
            new CardPanel
            {
                Location =
                    new Point(
                        40,
                        290),

                Size =
                    new Size(
                        680,
                        105)
            };


        Label infoTitle =
            new Label
            {
                Text =
                    "Installation information",

                Location =
                    new Point(
                        24,
                        18),

                Size =
                    new Size(
                        300,
                        24),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        Label infoText =
            new Label
            {
                Text =
                    "PCS is configured for a per-user installation. " +
                    "The default location is inside your Windows user profile, " +
                    "so normal installation does not require UAC elevation.",

                Location =
                    new Point(
                        24,
                        46),

                Size =
                    new Size(
                        620,
                        42),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        infoCard.Controls.Add(infoTitle);
        infoCard.Controls.Add(infoText);


        // =========================================================
        // ADD TO PAGE
        // =========================================================

        Controls.Add(locationCard);
        Controls.Add(infoCard);


        // =========================================================
        // INITIAL CONTEXT
        // =========================================================

        context.InstallPath =
            pathBox.Text.Trim();


        ResumeLayout(false);
    }


    private void PathBox_TextChanged(
        object? sender,
        EventArgs e)
    {
        context.InstallPath =
            pathBox.Text.Trim();


        UpdatePathStatus();
    }


    private void UpdatePathStatus()
    {
        if (pathStatusLabel == null ||
            pathBox == null)
        {
            return;
        }


        string path =
            pathBox.Text.Trim();


        if (string.IsNullOrWhiteSpace(path))
        {
            pathStatusLabel.Text =
                "Enter an installation folder.";

            pathStatusLabel.ForeColor =
                Colors.TextSecondary;

            return;
        }


        pathStatusLabel.Text =
            "✓ Installation location is ready.";

        pathStatusLabel.ForeColor =
            Colors.Success;
    }


    private void BrowseButton_Click(
        object? sender,
        EventArgs e)
    {
        using FolderBrowserDialog dialog =
            new FolderBrowserDialog
            {
                Description =
                    "Select PCS installation folder",

                UseDescriptionForTitle =
                    true,

                ShowNewFolderButton =
                    true
            };


        string currentPath =
            pathBox.Text.Trim();


        if (!string.IsNullOrWhiteSpace(currentPath) &&
            Directory.Exists(currentPath))
        {
            dialog.SelectedPath =
                currentPath;
        }


        if (dialog.ShowDialog() ==
            DialogResult.OK)
        {
            pathBox.Text =
                dialog.SelectedPath;

            context.InstallPath =
                dialog.SelectedPath;
        }
    }
}