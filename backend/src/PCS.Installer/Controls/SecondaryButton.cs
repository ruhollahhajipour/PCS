using PCS.Installer.Themes;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace PCS.Installer.Controls;

public class SecondaryButton : Button
{
    public SecondaryButton()
    {
        FlatStyle = FlatStyle.Flat;
        FlatAppearance.BorderSize = 0;

        Cursor = Cursors.Hand;

        Width = 130;
        Height = 42;

        BackColor = Color.White;
        ForeColor = Colors.Primary;

        Font = Fonts.Button;

        DoubleBuffered = true;

        MouseEnter += (_, _) =>
        {
            BackColor = Colors.Hover;
            Invalidate();
        };

        MouseLeave += (_, _) =>
        {
            BackColor = Color.White;
            Invalidate();
        };

        MouseDown += (_, _) =>
        {
            BackColor = Colors.PrimaryLight;
            Invalidate();
        };

        MouseUp += (_, _) =>
        {
            BackColor = Colors.Hover;
            Invalidate();
        };
    }

    protected override void OnPaint(PaintEventArgs e)
    {
        e.Graphics.SmoothingMode = SmoothingMode.AntiAlias;

        Rectangle rect = ClientRectangle;
        rect.Width--;
        rect.Height--;

        using GraphicsPath path = CreateRoundRectangle(rect, 10);

        using SolidBrush brush = new(BackColor);
        e.Graphics.FillPath(brush, path);

        using Pen pen = new(Colors.Border, 1);
        e.Graphics.DrawPath(pen, path);

        TextRenderer.DrawText(
            e.Graphics,
            Text,
            Font,
            rect,
            ForeColor,
            TextFormatFlags.HorizontalCenter |
            TextFormatFlags.VerticalCenter);
    }

    protected override void OnResize(EventArgs e)
    {
        base.OnResize(e);
        Invalidate();
    }

    private static GraphicsPath CreateRoundRectangle(Rectangle r, int radius)
    {
        GraphicsPath gp = new();

        int d = radius * 2;

        gp.AddArc(r.X, r.Y, d, d, 180, 90);
        gp.AddArc(r.Right - d, r.Y, d, d, 270, 90);
        gp.AddArc(r.Right - d, r.Bottom - d, d, d, 0, 90);
        gp.AddArc(r.X, r.Bottom - d, d, d, 90, 90);

        gp.CloseFigure();

        return gp;
    }
}