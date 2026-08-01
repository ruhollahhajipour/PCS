using PCS.Installer.Themes;
using System.ComponentModel;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace PCS.Installer.Controls;

public class StepIndicator : UserControl
{
    private readonly string[] steps =
    {
        "Welcome",
        "License",
        "Install",
        "Finish"
    };


    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public int CurrentStep { get; set; } = 0;


    public StepIndicator()
    {
        Height = 80;
        Dock = DockStyle.Top;

        BackColor = Color.White;

        DoubleBuffered = true;
        ResizeRedraw = true;
    }



    protected override void OnPaint(PaintEventArgs e)
    {
        base.OnPaint(e);

        Graphics g = e.Graphics;

        g.SmoothingMode =
            SmoothingMode.AntiAlias;


        int startX = 70;
        int y = 32;

        int spacing =
            (Width - 140) /
            (steps.Length - 1);



        // Connection lines
        for (int i = 0; i < steps.Length - 1; i++)
        {
            int x1 =
                startX + (spacing * i);

            int x2 =
                startX + (spacing * (i + 1));


            using Pen pen =
                new Pen(
                    i < CurrentStep
                        ? Colors.Primary
                        : Colors.Border,
                    3);


            g.DrawLine(
                pen,
                x1,
                y,
                x2,
                y);
        }



        // Steps
        for (int i = 0; i < steps.Length; i++)
        {
            int x =
                startX + (spacing * i);


            Color circleColor;


            if (i < CurrentStep)
                circleColor = Colors.Primary;

            else if (i == CurrentStep)
                circleColor = Colors.Primary;

            else
                circleColor = Colors.Border;



            using SolidBrush brush =
                new SolidBrush(circleColor);


            g.FillEllipse(
                brush,
                x - 16,
                y - 16,
                32,
                32);



            if (i < CurrentStep)
            {
                using Font font =
                    new Font(
                        "Segoe UI",
                        12,
                        FontStyle.Bold);


                TextRenderer.DrawText(
                    g,
                    "✓",
                    font,
                    new Rectangle(
                        x - 16,
                        y - 16,
                        32,
                        32),
                    Color.White,
                    TextFormatFlags.HorizontalCenter |
                    TextFormatFlags.VerticalCenter);
            }



            using Font stepFont =
                Fonts.Small;


            TextRenderer.DrawText(
                g,
                steps[i],
                stepFont,
                new Rectangle(
                    x - 45,
                    y + 25,
                    90,
                    22),
                Colors.TextPrimary,
                TextFormatFlags.HorizontalCenter);
        }
    }
}