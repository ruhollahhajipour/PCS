using System.Drawing;

namespace PCS.Installer.Themes;

public static class Colors
{
    // Primary
    public static readonly Color Primary = Color.FromArgb(25, 118, 210);
    public static readonly Color PrimaryDark = Color.FromArgb(13, 71, 161);
    public static readonly Color PrimaryLight = Color.FromArgb(227, 242, 253);

    // Accent
    public static readonly Color Accent = Color.FromArgb(0, 150, 136);

    // Success
    public static readonly Color Success = Color.FromArgb(46, 125, 50);

    // Warning
    public static readonly Color Warning = Color.FromArgb(237, 108, 2);

    // Error
    public static readonly Color Error = Color.FromArgb(211, 47, 47);

    // Background
    public static readonly Color Background = Color.FromArgb(245, 247, 250);

    public static readonly Color Card = Color.White;

    public static readonly Color Sidebar = Color.FromArgb(16, 24, 40);

    // Text

    public static readonly Color TextPrimary = Color.FromArgb(17, 24, 39);

    public static readonly Color TextSecondary = Color.FromArgb(107, 114, 128);

    public static readonly Color TextLight = Color.White;

    // Border

    public static readonly Color Border = Color.FromArgb(229, 231, 235);

    // Hover

    public static readonly Color Hover = Color.FromArgb(238, 242, 255);

    // Progress

    public static readonly Color ProgressBack = Color.FromArgb(228, 231, 237);

    public static readonly Color ProgressValue = Primary;

    // Wizard

    public static readonly Color ActiveStep = Primary;

    public static readonly Color CompletedStep = Success;

    public static readonly Color InactiveStep = Color.FromArgb(189, 189, 189);
}