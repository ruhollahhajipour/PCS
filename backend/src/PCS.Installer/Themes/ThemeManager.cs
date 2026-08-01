using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Themes;

public static class ThemeManager
{

    public static void Apply(Control control)
    {
        ApplyRecursive(control);
    }



    private static void ApplyRecursive(Control control)
    {

        if (control is Form form)
        {
            form.BackColor = Colors.Background;
            form.Font = Fonts.Body;
        }


        if (control is Button button)
        {
            button.BackColor = Colors.Primary;
            button.ForeColor = Color.White;

            button.FlatStyle =
                FlatStyle.Flat;

            button.FlatAppearance.BorderSize = 0;

            button.Font =
                Fonts.Button;
        }


        if (control is Label label)
        {
            label.ForeColor =
                Colors.TextPrimary;

            label.Font =
                Fonts.Body;
        }


        foreach (Control child in control.Controls)
        {
            ApplyRecursive(child);
        }
    }
}