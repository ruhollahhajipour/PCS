using PCS.Installer.Models;
using PCS.Installer.Pages;
using System.Drawing;
using System.Windows.Forms;

namespace PCS.Installer.Forms;

public class SummaryPage : InstallerPageBase
{
    private readonly InstallerContext context;

    private Label summaryLabel = null!;


    public SummaryPage(
        InstallerContext context)
    {
        this.context = context;


        PageTitle =
            "Installation Summary";


        PageDescription =
            "Review your installation settings before starting.";


        BuildContent();
    }





    private void BuildContent()
    {
        summaryLabel = new Label
        {
            Location =
                new Point(30, 80),

            Size =
                new Size(720, 380),

            Font =
                new Font(
                    "Segoe UI",
                    11),

            AutoSize = false,

            ForeColor =
                Color.FromArgb(40,40,40)
        };


        UpdateSummary();


        Controls.Add(summaryLabel);
    }





    private void UpdateSummary()
    {
        string installationType =
            context.InstallationType == InstallationType.Server
            ? "PCS Server"
            : "PCS Client";



        string database =
            context.DatabaseType == DatabaseType.SqlServer
            ? "SQL Server"
            : "SQLite";



        summaryLabel.Text =
$"""
Installation Summary

--------------------------------

Installation Type:
{installationType}


Installation Folder:
{context.InstallPath}


Database Type:
{database}


Database Server:
{context.DatabaseServer}


Database Name:
{context.DatabaseName}


Authentication:
{(context.WindowsAuthentication
    ? "Windows Authentication"
    : "SQL Authentication")}


Ready to install PCS.
""";
    }
}