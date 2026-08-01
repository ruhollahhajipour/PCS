using System.Drawing;

namespace PCS.Installer.Themes;

public static class Fonts
{
    // Font Family
    public const string DefaultFamily = "Segoe UI";

    // Large Titles
    public static readonly Font Title =
        new(DefaultFamily, 28, FontStyle.Bold);

    public static readonly Font Header =
        new(DefaultFamily, 20, FontStyle.Bold);

    public static readonly Font SubHeader =
        new(DefaultFamily, 14, FontStyle.Bold);

    // Body
    public static readonly Font Body =
        new(DefaultFamily, 10, FontStyle.Regular);

    public static readonly Font BodyBold =
        new(DefaultFamily, 10, FontStyle.Bold);

    public static readonly Font Small =
        new(DefaultFamily, 9, FontStyle.Regular);

    public static readonly Font SmallBold =
        new(DefaultFamily, 9, FontStyle.Bold);

    // Buttons
    public static readonly Font Button =
        new(DefaultFamily, 10, FontStyle.Bold);

    // Sidebar
    public static readonly Font Sidebar =
        new(DefaultFamily, 10, FontStyle.Regular);

    public static readonly Font SidebarSelected =
        new(DefaultFamily, 10, FontStyle.Bold);

    // Wizard
    public static readonly Font WizardTitle =
        new(DefaultFamily, 18, FontStyle.Bold);

    public static readonly Font WizardDescription =
        new(DefaultFamily, 10, FontStyle.Regular);

    // Footer
    public static readonly Font Footer =
        new(DefaultFamily, 9, FontStyle.Regular);

    // Progress
    public static readonly Font Progress =
        new(DefaultFamily, 9, FontStyle.Bold);
}