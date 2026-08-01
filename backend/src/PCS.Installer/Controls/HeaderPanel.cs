using PCS.Installer.Themes;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace PCS.Installer.Controls;

public class HeaderPanel : Panel
{
    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public string Title { get; set; } = "";


    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public string Subtitle { get; set; } = "";


    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public Image? Logo { get; set; }



    public HeaderPanel()
    {
        Dock = DockStyle.Top;

        Height = 95;

        DoubleBuffered = true;

        BackColor = Color.White;

        ResizeRedraw = true;
    }



    protected override void OnPaint(PaintEventArgs e)
    {
        base.OnPaint(e);


        Graphics g = e.Graphics;


        g.SmoothingMode =
            SmoothingMode.AntiAlias;


        g.Clear(Color.White);



        using SolidBrush titleBrush =
            new SolidBrush(Colors.TextPrimary);


        using SolidBrush subBrush =
            new SolidBrush(Colors.TextSecondary);



        int x = 30;



        if (Logo != null)
        {
            g.DrawImage(
                Logo,
                28,
                18,
                54,
                54);

            x = 100;
        }



        g.DrawString(
            Title,
            Fonts.Header,
            titleBrush,
            x,
            18);



        g.DrawString(
            Subtitle,
            Fonts.Body,
            subBrush,
            x,
            52);



        using Pen pen =
            new Pen(Colors.Border);


        g.DrawLine(
            pen,
            0,
            Height - 1,
            Width,
            Height - 1);
    }
}