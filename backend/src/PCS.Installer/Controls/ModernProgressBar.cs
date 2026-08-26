using PCS.Installer.Themes;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace PCS.Installer.Controls;

public class ModernProgressBar : Control
{
    private int minimum = 0;
    private int maximum = 100;
    private int value = 0;

    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public int Minimum
    {
        get => minimum;
        set
        {
            minimum = Math.Min(value, maximum);

            if (this.value < minimum)
                this.value = minimum;

            Invalidate();
        }
    }

    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public int Maximum
    {
        get => maximum;
        set
        {
            maximum = Math.Max(value, minimum);

            if (this.value > maximum)
                this.value = maximum;

            Invalidate();
        }
    }

    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public int Value
    {
        get => value;
        set
        {
            this.value =
                Math.Clamp(value, minimum, maximum);

            Invalidate();
        }
    }

    public ModernProgressBar()
    {
        Height = 12;

        MinimumSize =
            new Size(80, 12);

        BackColor =
            Colors.ProgressBack;

        DoubleBuffered = true;

        ResizeRedraw = true;
    }

    protected override void OnPaint(PaintEventArgs e)
    {
        base.OnPaint(e);

        Graphics g = e.Graphics;

        g.SmoothingMode =
            SmoothingMode.AntiAlias;

        Rectangle track =
            new Rectangle(
                0,
                0,
                Width - 1,
                Height - 1);

        using GraphicsPath trackPath =
            CreateRoundedPath(
                track,
                Height / 2);

        using SolidBrush trackBrush =
            new SolidBrush(
                Colors.ProgressBack);

        g.FillPath(
            trackBrush,
            trackPath);

        if (maximum <= minimum || value <= minimum)
            return;

        float ratio =
            (float)(value - minimum) /
            (maximum - minimum);

        int fillWidth =
            Math.Max(
                Height,
                (int)(Width * ratio));

        fillWidth =
            Math.Min(
                fillWidth,
                Width);

        Rectangle fill =
            new Rectangle(
                0,
                0,
                fillWidth,
                Height);

        using GraphicsPath fillPath =
            CreateRoundedPath(
                fill,
                Height / 2);

        using LinearGradientBrush gradient =
            new LinearGradientBrush(
                fill,
                Colors.Primary,
                Colors.Accent,
                LinearGradientMode.Horizontal);

        g.FillPath(
            gradient,
            fillPath);
    }

    private static GraphicsPath CreateRoundedPath(
        Rectangle rectangle,
        int radius)
    {
        GraphicsPath path =
            new GraphicsPath();

        int diameter =
            radius * 2;

        diameter =
            Math.Min(
                diameter,
                Math.Min(
                    rectangle.Width,
                    rectangle.Height));

        Rectangle arc =
            new Rectangle(
                rectangle.X,
                rectangle.Y,
                diameter,
                diameter);

        path.AddArc(
            arc,
            180,
            90);

        arc.X =
            rectangle.Right - diameter;

        path.AddArc(
            arc,
            270,
            90);

        arc.Y =
            rectangle.Bottom - diameter;

        path.AddArc(
            arc,
            0,
            90);

        arc.X =
            rectangle.X;

        path.AddArc(
            arc,
            90,
            90);

        path.CloseFigure();

        return path;
    }
}
