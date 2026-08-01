using PCS.Installer.Themes;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace PCS.Installer.Controls;

public class WizardHeader : UserControl
{
    private readonly Label lblTitle;
    private readonly Label lblDescription;
    private readonly PictureBox pictureLogo;
    private readonly Panel line;


    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public string Title
    {
        get
        {
            return lblTitle.Text;
        }
        set
        {
            lblTitle.Text = value;
        }
    }


    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public string Description
    {
        get
        {
            return lblDescription.Text;
        }
        set
        {
            lblDescription.Text = value;
        }
    }


    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public Image? Logo
    {
        get
        {
            return pictureLogo.Image;
        }
        set
        {
            pictureLogo.Image = value;
        }
    }



    public WizardHeader()
    {
        Dock = DockStyle.Top;

        Height = 96;

        BackColor = Color.White;


        pictureLogo = new PictureBox
        {
            Size = new Size(56, 56),
            Location = new Point(24, 20),
            SizeMode = PictureBoxSizeMode.Zoom,
            BackColor = Color.Transparent
        };


        lblTitle = new Label
        {
            AutoSize = false,
            Location = new Point(100, 18),
            Size = new Size(700, 32),
            Font = Fonts.Header,
            ForeColor = Colors.TextPrimary,
            BackColor = Color.Transparent
        };


        lblDescription = new Label
        {
            AutoSize = false,
            Location = new Point(100, 50),
            Size = new Size(760, 24),
            Font = Fonts.Body,
            ForeColor = Colors.TextSecondary,
            BackColor = Color.Transparent
        };


        line = new Panel
        {
            Dock = DockStyle.Bottom,
            Height = 1,
            BackColor = Colors.Border
        };


        Controls.Add(line);
        Controls.Add(lblDescription);
        Controls.Add(lblTitle);
        Controls.Add(pictureLogo);


        DoubleBuffered = true;
        ResizeRedraw = true;
    }



    protected override void OnPaint(PaintEventArgs e)
    {
        base.OnPaint(e);


        e.Graphics.SmoothingMode =
            SmoothingMode.AntiAlias;


        using (LinearGradientBrush brush =
            new LinearGradientBrush(
                ClientRectangle,
                Color.White,
                Color.FromArgb(248, 249, 251),
                90f))
        {
            e.Graphics.FillRectangle(
                brush,
                ClientRectangle);
        }
    }
}