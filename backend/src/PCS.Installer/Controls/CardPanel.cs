using PCS.Installer.Themes;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace PCS.Installer.Controls;

public class CardPanel : Panel
{
    public CardPanel()
    {
        BackColor = Colors.Card;

        Padding = new Padding(20);

        Margin = new Padding(12);

        DoubleBuffered = true;

        ResizeRedraw = true;
    }


    protected override void OnPaint(PaintEventArgs e)
    {
        base.OnPaint(e);


        e.Graphics.SmoothingMode =
            SmoothingMode.AntiAlias;


        using Pen pen =
            new Pen(Colors.Border);


        Rectangle rect =
            new Rectangle(
                0,
                0,
                Width - 1,
                Height - 1);


        e.Graphics.DrawRoundedRectangle(
            pen,
            rect,
            new Size(16, 16));
    }
}