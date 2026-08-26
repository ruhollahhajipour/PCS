using PCS.Installer.Controls;
using PCS.Installer.Models;
using PCS.Installer.Pages;
using PCS.Installer.Themes;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class InstallTypePage : InstallerPageBase
{
    private readonly InstallerContext context;

    private RadioButton serverRadio = null!;
    private RadioButton clientRadio = null!;

    private CardPanel serverCard = null!;
    private CardPanel clientCard = null!;


    public InstallTypePage(
        InstallerContext context)
    {
        this.context = context;

        PageTitle =
            "Installation Type";

        PageDescription =
            "Choose how PCS will be installed on this computer.";

        BuildContent();
    }


    private void BuildContent()
    {
        SuspendLayout();

        // =========================================================
        // SERVER CARD
        // =========================================================

        serverCard =
            new CardPanel
            {
                Location =
                    new Point(
                        40,
                        45),

                Size =
                    new Size(
                        330,
                        260),

                Cursor =
                    Cursors.Hand
            };


        Label serverBadge =
            new Label
            {
                Text =
                    "RECOMMENDED",

                Location =
                    new Point(
                        22,
                        18),

                Size =
                    new Size(
                        150,
                        22),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.Success,

                BackColor =
                    Color.Transparent
            };


        Label serverTitle =
            new Label
            {
                Text =
                    "PCS Server",

                Location =
                    new Point(
                        22,
                        48),

                Size =
                    new Size(
                        250,
                        34),

                Font =
                    Fonts.Header,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        Label serverDescription =
            new Label
            {
                Text =
                    "Complete PCS environment for hosting " +
                    "the application and project data.",

                Location =
                    new Point(
                        22,
                        88),

                Size =
                    new Size(
                        280,
                        48),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        Label serverFeatures =
            new Label
            {
                Text =
                    "✓ PCS Backend\r\n" +
                    "✓ Database\r\n" +
                    "✓ Web Application\r\n" +
                    "✓ Project Data",

                Location =
                    new Point(
                        22,
                        148),

                Size =
                    new Size(
                        230,
                        90),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        serverRadio =
            new RadioButton
            {
                Location =
                    new Point(
                        292,
                        20),

                Size =
                    new Size(
                        24,
                        24),

                Checked =
                    context.InstallationType ==
                    InstallationType.Server
            };


        serverCard.Controls.Add(serverBadge);
        serverCard.Controls.Add(serverTitle);
        serverCard.Controls.Add(serverDescription);
        serverCard.Controls.Add(serverFeatures);
        serverCard.Controls.Add(serverRadio);


        // =========================================================
        // CLIENT CARD
        // =========================================================

        clientCard =
            new CardPanel
            {
                Location =
                    new Point(
                        390,
                        45),

                Size =
                    new Size(
                        330,
                        260),

                Cursor =
                    Cursors.Hand
            };


        Label clientBadge =
            new Label
            {
                Text =
                    "CLIENT",

                Location =
                    new Point(
                        22,
                        18),

                Size =
                    new Size(
                        120,
                        22),

                Font =
                    Fonts.SmallBold,

                ForeColor =
                    Colors.Primary,

                BackColor =
                    Color.Transparent
            };


        Label clientTitle =
            new Label
            {
                Text =
                    "PCS Client",

                Location =
                    new Point(
                        22,
                        48),

                Size =
                    new Size(
                        250,
                        34),

                Font =
                    Fonts.Header,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        Label clientDescription =
            new Label
            {
                Text =
                    "Connect this computer to an existing " +
                    "PCS Server environment.",

                Location =
                    new Point(
                        22,
                        88),

                Size =
                    new Size(
                        280,
                        48),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent
            };


        Label clientFeatures =
            new Label
            {
                Text =
                    "✓ PCS Client\r\n" +
                    "✓ Server Connection\r\n" +
                    "✓ User Access\r\n" +
                    "✓ No Local Database",

                Location =
                    new Point(
                        22,
                        148),

                Size =
                    new Size(
                        250,
                        90),

                Font =
                    Fonts.Small,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent
            };


        clientRadio =
            new RadioButton
            {
                Location =
                    new Point(
                        292,
                        20),

                Size =
                    new Size(
                        24,
                        24),

                Checked =
                    context.InstallationType ==
                    InstallationType.Client
            };


        clientCard.Controls.Add(clientBadge);
        clientCard.Controls.Add(clientTitle);
        clientCard.Controls.Add(clientDescription);
        clientCard.Controls.Add(clientFeatures);
        clientCard.Controls.Add(clientRadio);


        // =========================================================
        // INFORMATION CARD
        // =========================================================

        CardPanel infoCard =
            new CardPanel
            {
                Location =
                    new Point(
                        40,
                        330),

                Size =
                    new Size(
                        680,
                        90)
            };


        Label infoTitle =
            new Label
            {
                Text =
                    "Which option should I choose?",

                Location =
                    new Point(
                        22,
                        16),

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
                    "Choose Server when this computer will host PCS. " +
                    "Choose Client when PCS is already hosted on another computer.",

                Location =
                    new Point(
                        22,
                        44),

                Size =
                    new Size(
                        620,
                        28),

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
        // EVENTS
        // =========================================================

        serverRadio.CheckedChanged +=
            InstallationTypeChanged;

        clientRadio.CheckedChanged +=
            InstallationTypeChanged;


        serverCard.Click +=
            (_, _) =>
            {
                serverRadio.Checked = true;
            };


        clientCard.Click +=
            (_, _) =>
            {
                clientRadio.Checked = true;
            };


        // =========================================================
        // ADD CONTROLS
        // =========================================================

        Controls.Add(serverCard);
        Controls.Add(clientCard);
        Controls.Add(infoCard);

        UpdateCardState();

        ResumeLayout(false);
    }


    private void InstallationTypeChanged(
        object? sender,
        EventArgs e)
    {
        if (serverRadio == null ||
            clientRadio == null)
        {
            return;
        }


        if (serverRadio.Checked)
        {
            context.InstallationType =
                InstallationType.Server;
        }
        else if (clientRadio.Checked)
        {
            context.InstallationType =
                InstallationType.Client;
        }


        UpdateCardState();
    }


    private void UpdateCardState()
    {
        if (serverCard == null ||
            clientCard == null)
        {
            return;
        }


        serverCard.Invalidate();
        clientCard.Invalidate();
    }
}