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

    private int currentStep;

    [DesignerSerializationVisibility(
        DesignerSerializationVisibility.Hidden)]
    public int CurrentStep
    {
        get => currentStep;

        set
        {
            currentStep =
                Math.Clamp(
                    value,
                    0,
                    steps.Length - 1);

            Invalidate();
        }
    }

    public StepIndicator()
    {
        Height = 76;

        Dock =
            DockStyle.Top;

        BackColor =
            Colors.Shell;

        DoubleBuffered =
            true;

        ResizeRedraw =
            true;

        TabStop =
            false;
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

        int horizontalPadding = 64;

        int startX =
            horizontalPadding;

        int endX =
            Math.Max(
                startX,
                Width - horizontalPadding);

        int centerY =
            27;

        int spacing =
            steps.Length > 1
                ? (endX - startX) /
                  (steps.Length - 1)
                : 0;


        // ==========================================================
        // CONNECTOR TRACK
        // ==========================================================

        for (int i = 0;
             i < steps.Length - 1;
             i++)
        {
            int x1 =
                startX +
                spacing * i;

            int x2 =
                startX +
                spacing * (i + 1);


            Rectangle track =
                new Rectangle(
                    x1 + 15,
                    centerY - 1,
                    Math.Max(
                        1,
                        x2 - x1 - 30),
                    2);


            using SolidBrush trackBrush =
                new SolidBrush(
                    Colors.Border);

            g.FillRectangle(
                trackBrush,
                track);


            // Completed section
            if (i < currentStep)
            {
                Rectangle completedTrack =
                    new Rectangle(
                        x1 + 15,
                        centerY - 1,
                        Math.Max(
                            1,
                            x2 - x1 - 30),
                        2);


                using LinearGradientBrush
                    completedBrush =
                        new LinearGradientBrush(
                            completedTrack,
                            Colors.Success,
                            Colors.Primary,
                            0f);

                g.FillRectangle(
                    completedBrush,
                    completedTrack);
            }
        }


        // ==========================================================
        // STEPS
        // ==========================================================

        for (int i = 0;
             i < steps.Length;
             i++)
        {
            int x =
                startX +
                spacing * i;


            bool completed =
                i < currentStep;

            bool active =
                i == currentStep;

            bool upcoming =
                i > currentStep;


            DrawStep(
                g,
                x,
                centerY,
                i,
                completed,
                active,
                upcoming);
        }
    }


    private void DrawStep(
        Graphics g,
        int x,
        int centerY,
        int index,
        bool completed,
        bool active,
        bool upcoming)
    {
        const int outerRadius = 15;
        const int innerRadius = 11;


        // ==========================================================
        // ACTIVE OUTER GLOW
        // ==========================================================

        if (active)
        {
            using SolidBrush glowOuter =
                new SolidBrush(
                    Color.FromArgb(
                        18,
                        Colors.Primary));

            g.FillEllipse(
                glowOuter,
                x - 21,
                centerY - 21,
                42,
                42);


            using SolidBrush glowInner =
                new SolidBrush(
                    Color.FromArgb(
                        28,
                        Colors.Primary));

            g.FillEllipse(
                glowInner,
                x - 18,
                centerY - 18,
                36,
                36);
        }


        // ==========================================================
        // OUTER CIRCLE
        // ==========================================================

        Rectangle outer =
            new Rectangle(
                x - outerRadius,
                centerY - outerRadius,
                outerRadius * 2,
                outerRadius * 2);


        Color outerColor;

        if (completed)
        {
            outerColor =
                Colors.Success;
        }
        else if (active)
        {
            outerColor =
                Colors.Primary;
        }
        else
        {
            outerColor =
                Colors.Border;
        }


        using SolidBrush outerBrush =
            new SolidBrush(
                outerColor);

        g.FillEllipse(
            outerBrush,
            outer);


        // ==========================================================
        // INNER CIRCLE
        // ==========================================================

        Rectangle inner =
            new Rectangle(
                x - innerRadius,
                centerY - innerRadius,
                innerRadius * 2,
                innerRadius * 2);


        if (upcoming)
        {
            using SolidBrush innerBrush =
                new SolidBrush(
                    Colors.Shell);

            g.FillEllipse(
                innerBrush,
                inner);
        }
        else
        {
            Color innerColor =
                completed
                    ? Colors.Success
                    : Colors.Primary;

            using SolidBrush innerBrush =
                new SolidBrush(
                    innerColor);

            g.FillEllipse(
                innerBrush,
                inner);
        }


        // ==========================================================
        // MARKER
        // ==========================================================

        string marker;

        if (completed)
        {
            marker = "✓";
        }
        else
        {
            marker =
                (index + 1)
                .ToString("00");
        }


        using Font markerFont =
            new Font(
                "Segoe UI",
                completed
                    ? 8.5f
                    : 7.5f,
                FontStyle.Bold);


        TextRenderer.DrawText(
            g,
            marker,
            markerFont,
            inner,
            Color.White,
            TextFormatFlags.HorizontalCenter |
            TextFormatFlags.VerticalCenter |
            TextFormatFlags.NoPadding);


        // ==========================================================
        // STEP TITLE
        // ==========================================================

        Color textColor;

        if (active)
        {
            textColor =
                Colors.TextPrimary;
        }
        else if (completed)
        {
            textColor =
                Colors.TextPrimary;
        }
        else
        {
            textColor =
                Colors.TextMuted;
        }


        Font stepFont;

        if (active)
        {
            stepFont =
                Fonts.SmallBold;
        }
        else
        {
            stepFont =
                Fonts.Small;
        }


        Rectangle textRectangle =
            new Rectangle(
                x - 55,
                centerY + 19,
                110,
                20);


        TextRenderer.DrawText(
            g,
            steps[index],
            stepFont,
            textRectangle,
            textColor,
            TextFormatFlags.HorizontalCenter |
            TextFormatFlags.VerticalCenter |
            TextFormatFlags.NoPadding);


        // ==========================================================
        // ACTIVE UNDERLINE / ACCENT
        // ==========================================================

        if (active)
        {
            int underlineWidth =
                28;

            Rectangle underline =
                new Rectangle(
                    x - underlineWidth / 2,
                    centerY + 43,
                    underlineWidth,
                    2);


            using GraphicsPath path =
                CreateRoundedRectangle(
                    underline,
                    1);

            using SolidBrush accentBrush =
                new SolidBrush(
                    Colors.Primary);

            g.FillPath(
                accentBrush,
                path);
        }
    }


    private static GraphicsPath CreateRoundedRectangle(
        Rectangle rectangle,
        int radius)
    {
        GraphicsPath path =
            new GraphicsPath();

        int diameter =
            radius * 2;


        if (diameter <= 0)
        {
            path.AddRectangle(
                rectangle);

            return path;
        }


        path.AddArc(
            rectangle.X,
            rectangle.Y,
            diameter,
            diameter,
            180,
            90);

        path.AddArc(
            rectangle.Right - diameter,
            rectangle.Y,
            diameter,
            diameter,
            270,
            90);

        path.AddArc(
            rectangle.Right - diameter,
            rectangle.Bottom - diameter,
            diameter,
            diameter,
            0,
            90);

        path.AddArc(
            rectangle.X,
            rectangle.Bottom - diameter,
            diameter,
            diameter,
            90,
            90);

        path.CloseFigure();

        return path;
    }
}