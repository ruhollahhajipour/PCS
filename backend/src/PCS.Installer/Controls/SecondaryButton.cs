using PCS.Installer.Themes;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Windows.Forms;

namespace PCS.Installer.Controls;

public class SecondaryButton : Button
{
    private bool isHovered;
    private bool isPressed;

    public SecondaryButton()
    {
        FlatStyle =
            FlatStyle.Flat;

        FlatAppearance.BorderSize =
            0;

        FlatAppearance.MouseDownBackColor =
            Color.Transparent;

        FlatAppearance.MouseOverBackColor =
            Color.Transparent;

        UseVisualStyleBackColor =
            false;

        Cursor =
            Cursors.Hand;

        Width =
            130;

        Height =
            42;

        Font =
            Fonts.Button;

        ForeColor =
            Colors.TextPrimary;

        BackColor =
            Colors.Card;

        DoubleBuffered =
            true;

        SetStyle(
            ControlStyles.UserPaint |
            ControlStyles.AllPaintingInWmPaint |
            ControlStyles.OptimizedDoubleBuffer |
            ControlStyles.ResizeRedraw,
            true);


        MouseEnter +=
            (_, _) =>
            {
                isHovered =
                    true;

                Invalidate();
            };


        MouseLeave +=
            (_, _) =>
            {
                isHovered =
                    false;

                isPressed =
                    false;

                Invalidate();
            };


        MouseDown +=
            (_, e) =>
            {
                if (e.Button ==
                    MouseButtons.Left)
                {
                    isPressed =
                        true;

                    Invalidate();
                }
            };


        MouseUp +=
            (_, e) =>
            {
                if (e.Button ==
                    MouseButtons.Left)
                {
                    isPressed =
                        false;

                    Invalidate();
                }
            };
    }


    protected override void OnPaint(
        PaintEventArgs e)
    {
        Graphics g =
            e.Graphics;

        g.SmoothingMode =
            SmoothingMode.AntiAlias;

        g.PixelOffsetMode =
            PixelOffsetMode.HighQuality;

        g.TextRenderingHint =
            System.Drawing.Text.TextRenderingHint.ClearTypeGridFit;


        Rectangle rect =
            ClientRectangle;

        rect.Width -= 1;
        rect.Height -= 1;


        // =========================================================
        // PRESS EFFECT
        // =========================================================

        if (isPressed)
        {
            rect.Offset(
                1,
                2);
        }


        // =========================================================
        // SHADOW
        // =========================================================

        if (!isPressed)
        {
            Rectangle shadowRect =
                rect;

            shadowRect.Offset(
                0,
                3);

            using GraphicsPath shadowPath =
                CreateRoundRectangle(
                    shadowRect,
                    10);

            using SolidBrush shadowBrush =
                new SolidBrush(
                    Color.FromArgb(
                        80,
                        0,
                        0,
                        0));

            g.FillPath(
                shadowBrush,
                shadowPath);
        }


        // =========================================================
        // BUTTON BACKGROUND
        // =========================================================

        Color backgroundColor;


        if (isPressed)
        {
            backgroundColor =
                Colors.BackgroundDeep;
        }
        else if (isHovered)
        {
            backgroundColor =
                Colors.Hover;
        }
        else
        {
            backgroundColor =
                Colors.Card;
        }


        using GraphicsPath path =
            CreateRoundRectangle(
                rect,
                10);


        using SolidBrush backgroundBrush =
            new SolidBrush(
                backgroundColor);

        g.FillPath(
            backgroundBrush,
            path);


        // =========================================================
        // TOP HIGHLIGHT
        // =========================================================

        if (!isPressed)
        {
            Rectangle highlightRect =
                new Rectangle(
                    rect.X + 2,
                    rect.Y + 1,
                    rect.Width - 4,
                    1);

            using SolidBrush highlightBrush =
                new SolidBrush(
                    Color.FromArgb(
                        isHovered
                            ? 90
                            : 45,
                        255,
                        255,
                        255));

            g.FillRectangle(
                highlightBrush,
                highlightRect);
        }


        // =========================================================
        // BORDER
        // =========================================================

        Color borderColor =
            isHovered
                ? Colors.BorderLight
                : Colors.Border;


        using Pen borderPen =
            new Pen(
                borderColor,
                1f);

        g.DrawPath(
            borderPen,
            path);


        // =========================================================
        // TEXT
        // =========================================================

        Rectangle textRect =
            rect;

        if (isPressed)
        {
            textRect.Offset(
                0,
                1);
        }


        Color textColor =
            isHovered
                ? Colors.TextLight
                : Colors.TextPrimary;


        TextRenderer.DrawText(
            g,
            Text,
            Font,
            textRect,
            textColor,
            TextFormatFlags.HorizontalCenter |
            TextFormatFlags.VerticalCenter |
            TextFormatFlags.NoPadding);
    }


    protected override void OnResize(
        EventArgs e)
    {
        base.OnResize(e);

        Invalidate();
    }


    private static GraphicsPath CreateRoundRectangle(
        Rectangle rectangle,
        int radius)
    {
        GraphicsPath path =
            new GraphicsPath();

        int diameter =
            radius * 2;


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
