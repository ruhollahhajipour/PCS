using System.Drawing;

namespace PCS.Installer.Themes;

public static class Colors
{
    // ============================================================
    // PCS Enterprise Navy Theme
    // ============================================================

    public static readonly Color Primary =
        Color.FromArgb(25, 73, 112);

    public static readonly Color PrimaryDark =
        Color.FromArgb(15, 48, 76);

    public static readonly Color PrimaryLight =
        Color.FromArgb(42, 94, 135);

    public static readonly Color Accent =
        Color.FromArgb(48, 151, 211);

    public static readonly Color Success =
        Color.FromArgb(43, 157, 116);

    public static readonly Color Warning =
        Color.FromArgb(221, 151, 43);

    public static readonly Color Error =
        Color.FromArgb(202, 67, 67);


    // ============================================================
    // Application Shell
    // ============================================================

    public static readonly Color Background =
        Color.FromArgb(244, 246, 249);

    public static readonly Color BackgroundDeep =
        Color.FromArgb(235, 239, 244);

    public static readonly Color Shell =
        Color.FromArgb(17, 45, 69);

    public static readonly Color Card =
        Color.FromArgb(255, 255, 255);

    public static readonly Color CardLight =
        Color.FromArgb(248, 250, 252);

    public static readonly Color Sidebar =
        Color.FromArgb(14, 39, 60);


    // ============================================================
    // Header
    // ============================================================

    public static readonly Color Header =
        Color.FromArgb(17, 45, 69);

    public static readonly Color HeaderLight =
        Color.FromArgb(25, 61, 88);

    public static readonly Color HeaderText =
        Color.White;

    public static readonly Color HeaderTextSecondary =
        Color.FromArgb(191, 207, 220);


    // ============================================================
    // Text
    // ============================================================

    public static readonly Color TextPrimary =
        Color.FromArgb(25, 35, 45);

    public static readonly Color TextSecondary =
        Color.FromArgb(91, 104, 117);

    public static readonly Color TextMuted =
        Color.FromArgb(139, 149, 160);

    public static readonly Color TextLight =
        Color.White;


    // ============================================================
    // Borders / Surfaces
    // ============================================================

    public static readonly Color Border =
        Color.FromArgb(218, 224, 231);

    public static readonly Color BorderLight =
        Color.FromArgb(231, 235, 240);

    public static readonly Color Hover =
        Color.FromArgb(235, 242, 248);


    // ============================================================
    // Progress
    // ============================================================

    public static readonly Color ProgressBack =
        Color.FromArgb(216, 224, 232);

    public static readonly Color ProgressValue =
        Primary;


    // ============================================================
    // Wizard
    // ============================================================

    public static readonly Color ActiveStep =
        Primary;

    public static readonly Color CompletedStep =
        Success;

    public static readonly Color InactiveStep =
        Color.FromArgb(171, 182, 193);
}