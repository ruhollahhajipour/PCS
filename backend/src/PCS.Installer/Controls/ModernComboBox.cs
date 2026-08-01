namespace PCS.Installer.Controls;

public class ModernComboBox : ComboBox
{
    public ModernComboBox()
    {
        Font = Themes.Fonts.Body;

        DropDownStyle = ComboBoxStyle.DropDownList;

        Height = 38;
    }
}