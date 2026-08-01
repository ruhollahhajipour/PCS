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
        Dock = DockStyle.Fill;

        BackColor = Color.White;

        BuildBaseUI();
    }



    private void BuildBaseUI()
    {
        TitleLabel = new Label
        {
            AutoSize = true,
            Font = new Font(
                "Segoe UI",
                18,
                FontStyle.Bold),
            ForeColor =
                Color.FromArgb(15, 23, 42),
            Location =
                new Point(20, 20)
        };


        DescriptionLabel = new Label
        {
            AutoSize = true,
            Font = new Font(
                "Segoe UI",
                10),
            ForeColor =
                Color.Gray,
            Location =
                new Point(22, 60)
        };


        Controls.Add(TitleLabel);

        Controls.Add(DescriptionLabel);
    }
}