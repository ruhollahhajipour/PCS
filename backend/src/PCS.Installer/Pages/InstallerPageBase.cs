using PCS.Installer.Themes;
using System.ComponentModel;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Pages;

public abstract class InstallerPageBase : UserControl
{
    protected Label TitleLabel = null!;

    protected Label DescriptionLabel = null!;


    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public string PageTitle
    {
        get => TitleLabel.Text;
        set => TitleLabel.Text = value;
    }


    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public string PageDescription
    {
        get => DescriptionLabel.Text;
        set => DescriptionLabel.Text = value;
    }


    protected InstallerPageBase()
    {
        // =========================================================
        // BASIC CONTROL SETTINGS
        // =========================================================

        Dock =
            DockStyle.Fill;

        BackColor =
            Colors.Background;

        DoubleBuffered =
            true;


        // =========================================================
        // DPI SCALING
        // =========================================================
        //
        // The previous AutoScaleMode.None prevented WinForms from
        // adapting the fixed-size UI to 125%, 150%, etc. displays.
        //
        // Program.cs enables PerMonitorV2, and pages use DPI scaling.
        //

        AutoScaleMode =
            AutoScaleMode.Dpi;


        AutoScaleDimensions =
            new SizeF(
                96F,
                96F);


        BuildBaseUI();
    }


    private void BuildBaseUI()
    {
        // ==========================================================
        // PAGE TITLE
        // ==========================================================

        TitleLabel =
            new Label
            {
                AutoSize =
                    false,

                Location =
                    new Point(
                        28,
                        12),

                Size =
                    new Size(
                        740,
                        30),

                Font =
                    Fonts.WizardTitle,

                ForeColor =
                    Colors.TextPrimary,

                BackColor =
                    Color.Transparent,

                TextAlign =
                    ContentAlignment.MiddleLeft,

                Anchor =
                    AnchorStyles.Top |
                    AnchorStyles.Left |
                    AnchorStyles.Right
            };


        // ==========================================================
        // PAGE DESCRIPTION
        // ==========================================================

        DescriptionLabel =
            new Label
            {
                AutoSize =
                    false,

                Location =
                    new Point(
                        30,
                        43),

                Size =
                    new Size(
                        740,
                        24),

                Font =
                    Fonts.WizardDescription,

                ForeColor =
                    Colors.TextSecondary,

                BackColor =
                    Color.Transparent,

                TextAlign =
                    ContentAlignment.MiddleLeft,

                Anchor =
                    AnchorStyles.Top |
                    AnchorStyles.Left |
                    AnchorStyles.Right
            };


        Controls.Add(
            TitleLabel);

        Controls.Add(
            DescriptionLabel);
    }
}