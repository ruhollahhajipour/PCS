namespace PCS.Installer.Controls;

public class ModernTextBox : TextBox
{
    public ModernTextBox()
    {
        BorderStyle = BorderStyle.FixedSingle;

        Font = Themes.Fonts.Body;

        Height = 38;

        Margin = new Padding(8);
    }
}