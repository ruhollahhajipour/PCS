using System.Drawing;

namespace PCS.Installer.Themes;

public static class Fonts
{
    public const string DefaultFamily = "Segoe UI";


    public static readonly Font Title =
        new(DefaultFamily, 20, FontStyle.Bold);


    public static readonly Font Header =
        new(DefaultFamily, 15, FontStyle.Bold);


    public static readonly Font SubHeader =
        new(DefaultFamily, 10.5f, FontStyle.Bold);


    public static readonly Font Body =
        new(DefaultFamily, 9, FontStyle.Regular);


    public static readonly Font BodyBold =
        new(DefaultFamily, 9, FontStyle.Bold);


    public static readonly Font Small =
        new(DefaultFamily, 8, FontStyle.Regular);


    public static readonly Font SmallBold =
        new(DefaultFamily, 8, FontStyle.Bold);


    public static readonly Font Button =
        new(DefaultFamily, 9, FontStyle.Bold);


    public static readonly Font Sidebar =
        new(DefaultFamily, 8.5f, FontStyle.Regular);


    public static readonly Font SidebarSelected =
        new(DefaultFamily, 8.5f, FontStyle.Bold);


    public static readonly Font WizardTitle =
        new(DefaultFamily, 15, FontStyle.Bold);


    public static readonly Font WizardDescription =
        new(DefaultFamily, 8.5f, FontStyle.Regular);


    public static readonly Font Footer =
        new(DefaultFamily, 8, FontStyle.Regular);


    public static readonly Font Progress =
        new(DefaultFamily, 8.5f, FontStyle.Bold);


    public static readonly Font ProgressPercent =
        new(DefaultFamily, 18, FontStyle.Bold);
}