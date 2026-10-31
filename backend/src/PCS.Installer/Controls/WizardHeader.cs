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
    private readonly Panel line;
    private readonly PictureBox logoBox;

    private Image? logoImage;


    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public string Title
    {
        get => lblTitle.Text;
        set
        {
            lblTitle.Text = value;
            Invalidate();
        }
    }


    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public string Description
    {
        get => lblDescription.Text;
        set
        {
            lblDescription.Text = value;
            Invalidate();
        }
    }


    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public Image? Logo
    {
        get => logoImage;

        set
        {
            if (ReferenceEquals(logoImage, value))
            {
                return;
            }


            if (logoBox.Image != null &&
                !ReferenceEquals(logoBox.Image, value))
            {
                logoBox.Image.Dispose();
            }


            logoImage =
                value;

            logoBox.Image =
                logoImage;

            logoBox.Visible =
                logoImage != null;

            Invalidate();
        }
    }


    public WizardHeader()
    {
        Dock =
            DockStyle.Top;

        Height =
            96;

        BackColor =
            Colors.Header;

        DoubleBuffered =
            true;

        ResizeRedraw =
            true;


        // =========================================================
        // LOGO
        // =========================================================

        logoBox =
            new PictureBox
            {
                Location =
                    new Point(
                        24,
                        18),

                Size =
                    new Size(
                        64,
                        60),

                SizeMode =
                    PictureBoxSizeMode.Zoom,

                BackColor =
                    Color.Transparent,

                TabStop =
                    false
            };


        // =========================================================
        // TITLE
        // =========================================================

        lblTitle =
            new Label
            {
                AutoSize =
                    false,

                Location =
                    new Point(
                        102,
                        20),

                Size =
                    new Size(
                        720,
                        30),

                Font =
                    Fonts.WizardTitle,

                ForeColor =
                    Colors.HeaderText,

                BackColor =
                    Color.Transparent,

                TextAlign =
                    ContentAlignment.MiddleLeft
            };


        // =========================================================
        // DESCRIPTION
        // =========================================================

        lblDescription =
            new Label
            {
                AutoSize =
                    false,

                Location =
                    new Point(
                        103,
                        52),

                Size =
                    new Size(
                        740,
                        22),

                Font =
                    Fonts.WizardDescription,

                ForeColor =
                    Colors.HeaderTextSecondary,

                BackColor =
                    Color.Transparent,

                TextAlign =
                    ContentAlignment.MiddleLeft
            };


        // =========================================================
        // BOTTOM LINE
        // =========================================================

        line =
            new Panel
            {
                Dock =
                    DockStyle.Bottom,

                Height =
                    1,

                BackColor =
                    Color.FromArgb(
                        48,
                        82,
                        110)
            };


        Controls.Add(
            logoBox);

        Controls.Add(
            lblDescription);

        Controls.Add(
            lblTitle);

        Controls.Add(
            line);


        LoadLogo();
    }


    // =============================================================
    // LOAD CENTRAL PCS LOGO
    // =============================================================

    private void LoadLogo()
    {
        try
        {
            string logoPath =
                Path.Combine(
                    AppContext.BaseDirectory,
                    "Resources",
                    "Branding",
                    "logo.png");


            if (!File.Exists(logoPath))
            {
                logoBox.Visible =
                    false;

                return;
            }


            using FileStream stream =
                new FileStream(
                    logoPath,
                    FileMode.Open,
                    FileAccess.Read,
                    FileShare.ReadWrite);


            using Image source =
                Image.FromStream(stream);


            logoImage =
                new Bitmap(source);


            logoBox.Image =
                logoImage;

            logoBox.Visible =
                true;
        }
        catch
        {
            logoBox.Visible =
                false;
        }
    }


    protected override void OnPaint(
        PaintEventArgs e)
    {
        base.OnPaint(e);


        Graphics g =
            e.Graphics;


        g.SmoothingMode =
            SmoothingMode.AntiAlias;

        g.PixelOffsetMode =
            PixelOffsetMode.HighQuality;

        g.TextRenderingHint =
            System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;


        // =========================================================
        // HEADER BACKGROUND
        // =========================================================

        Rectangle rect =
            ClientRectangle;


        using LinearGradientBrush brush =
            new LinearGradientBrush(
                rect,
                Colors.Header,
                Colors.HeaderLight,
                0f);


        g.FillRectangle(
            brush,
            rect);


        // =========================================================
        // VERY SUBTLE TOP HIGHLIGHT
        // =========================================================

        using SolidBrush highlightBrush =
            new SolidBrush(
                Color.FromArgb(
                    10,
                    255,
                    255,
                    255));


        g.FillRectangle(
            highlightBrush,
            new Rectangle(
                0,
                0,
                Width,
                1));


        // =========================================================
        // BOTTOM ACCENT
        // =========================================================

        int primaryWidth =
            Math.Max(
                1,
                Width * 3 / 5);


        using SolidBrush primaryBrush =
            new SolidBrush(
                Colors.Primary);


        g.FillRectangle(
            primaryBrush,
            new Rectangle(
                0,
                Height - 2,
                primaryWidth,
                2));


        int accentStart =
            primaryWidth;


        int accentWidth =
            Math.Max(
                1,
                Width / 8);


        using SolidBrush accentBrush =
            new SolidBrush(
                Colors.Accent);


        g.FillRectangle(
            accentBrush,
            new Rectangle(
                accentStart,
                Height - 2,
                accentWidth,
                2));
    }


    protected override void Dispose(
        bool disposing)
    {
        if (disposing)
        {
            if (logoBox.Image != null)
            {
                logoBox.Image.Dispose();

                logoBox.Image =
                    null;
            }


            logoImage =
                null;
        }


        base.Dispose(disposing);
    }
}