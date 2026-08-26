using System.Drawing;

namespace PCS.Application.Common.Theme;

public static class ThemeColorGenerator
{
    /// <summary>
    /// Generate WBS hierarchy colors.
    /// Level 1 = darkest / strongest
    /// Higher levels = lighter
    /// Activity = white
    /// </summary>
    public static IReadOnlyList<string> GenerateWbsLevels(
        string primaryColor,
        int levelCount)
    {
        if (levelCount <= 0)
            return Array.Empty<string>();


        var colors =
            new List<string>();


        var baseColor =
            HexToRgb(primaryColor);



        var hue =
            baseColor.GetHue();


        var saturation =
            Math.Clamp(
                baseColor.GetSaturation(),
                0.25f,
                0.85f);



        for(int i = 0; i < levelCount; i++)
        {
            double ratio =
                levelCount == 1
                ? 0
                :
                (double)i /
                (levelCount - 1);



            //------------------------------------------------
            // Level 1
            // Dark + Strong
            //
            // Level N
            // Light + Soft
            //------------------------------------------------

            float lightness =
                0.28f +
                (float)(ratio * 0.52);



            float levelSaturation =
                saturation -
                (float)(ratio * 0.30);



            levelSaturation =
                Math.Clamp(
                    levelSaturation,
                    0.15f,
                    0.85f);



            var color =
                FromHsl(
                    hue,
                    levelSaturation,
                    lightness);



            colors.Add(
                RgbToHex(color));
        }



        return colors;
    }






    /// <summary>
    /// Activity rows remain white
    /// </summary>
    public static string ActivityColor()
    {
        return "#FFFFFF";
    }






    private static Color FromHsl(
        float h,
        float s,
        float l)
    {
        h /= 360f;


        float r;
        float g;
        float b;


        if(s == 0)
        {
            r = g = b = l;
        }
        else
        {
            float q =
                l < 0.5f
                ?
                l * (1 + s)
                :
                l + s - l * s;


            float p =
                2 * l - q;


            r = HueToRgb(
                p,
                q,
                h + 1f / 3f);


            g = HueToRgb(
                p,
                q,
                h);


            b = HueToRgb(
                p,
                q,
                h - 1f / 3f);
        }


        return Color.FromArgb(
            (int)(r * 255),
            (int)(g * 255),
            (int)(b * 255));
    }





    private static float HueToRgb(
        float p,
        float q,
        float t)
    {
        if(t < 0)
            t += 1;


        if(t > 1)
            t -= 1;


        if(t < 1f / 6f)
            return p + (q - p) * 6 * t;


        if(t < 1f / 2f)
            return q;


        if(t < 2f / 3f)
            return p + (q - p) *
                (2f / 3f - t) * 6;


        return p;
    }







    private static Color HexToRgb(
        string hex)
    {
        hex =
            hex.Replace("#", "");


        return Color.FromArgb(
            Convert.ToInt32(hex.Substring(0, 2), 16),
            Convert.ToInt32(hex.Substring(2, 2), 16),
            Convert.ToInt32(hex.Substring(4, 2), 16));
    }







    private static string RgbToHex(
        Color color)
    {
        return
            $"#{color.R:X2}{color.G:X2}{color.B:X2}";
    }
}