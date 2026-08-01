using PCS.Installer.Themes;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Controls;

public class TitleLabel : Label
{
    public TitleLabel()
    {
        AutoSize = true;

        Font = Fonts.Header;

        ForeColor = Colors.TextPrimary;

        BackColor = Color.Transparent;

        TextAlign = ContentAlignment.MiddleLeft;
    }
}