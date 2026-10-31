using ClosedXML.Excel;

using PCS.Application.Planning.DTOs;
using PCS.Application.Planning.Interfaces;
using PCS.Application.Planning.Export.Excel.Builders;


namespace PCS.Application.Planning.Export.Excel;

public sealed class PcsProfessionalPmsExcelExporter
    : IPcsProfessionalPmsExporter
{
    private readonly CoverSheetBuilder _coverSheetBuilder;

    private readonly DashboardSheetBuilder _dashboardSheetBuilder;

    private readonly WbsSheetBuilder _wbsSheetBuilder;

    private readonly ActivitiesSheetBuilder _activitiesSheetBuilder;

    private readonly EvmSheetBuilder _evmSheetBuilder;

    private readonly ProgressSheetBuilder _progressSheetBuilder;

    private readonly PmsSheetBuilder _pmsSheetBuilder;



    public PcsProfessionalPmsExcelExporter(
        CoverSheetBuilder coverSheetBuilder,
        DashboardSheetBuilder dashboardSheetBuilder,
        WbsSheetBuilder wbsSheetBuilder,
        ActivitiesSheetBuilder activitiesSheetBuilder,
        EvmSheetBuilder evmSheetBuilder,
        ProgressSheetBuilder progressSheetBuilder,
        PmsSheetBuilder pmsSheetBuilder)
    {
        _coverSheetBuilder = coverSheetBuilder;

        _dashboardSheetBuilder = dashboardSheetBuilder;

        _wbsSheetBuilder = wbsSheetBuilder;

        _activitiesSheetBuilder = activitiesSheetBuilder;

        _evmSheetBuilder = evmSheetBuilder;

        _progressSheetBuilder = progressSheetBuilder;

        _pmsSheetBuilder = pmsSheetBuilder;
    }





    public async Task<byte[]> GenerateAsync(
        ExportPmsDto dto)
    {
        using var workbook =
            new XLWorkbook();



        //--------------------------------------------------
        // Cover
        //--------------------------------------------------

        _coverSheetBuilder.Build(
            workbook,
            dto);



        //--------------------------------------------------
        // Dashboard
        //--------------------------------------------------

        _dashboardSheetBuilder.Build(
            workbook,
            dto);



        //--------------------------------------------------
        // PMS Main Sheet
        //--------------------------------------------------

        _pmsSheetBuilder.Build(
            workbook,
            dto);



        //--------------------------------------------------
        // WBS
        //--------------------------------------------------

        _wbsSheetBuilder.Build(
            workbook,
            dto);



        //--------------------------------------------------
        // Activities
        //--------------------------------------------------

        _activitiesSheetBuilder.Build(
            workbook,
            dto);



        //--------------------------------------------------
        // Progress
        //--------------------------------------------------

        _progressSheetBuilder.Build(
            workbook,
            dto);



        //--------------------------------------------------
        // EVM
        //--------------------------------------------------

        _evmSheetBuilder.Build(
            workbook,
            dto);




        using var stream =
            new MemoryStream();


        workbook.SaveAs(stream);



        return await Task.FromResult(
            stream.ToArray());
    }
}