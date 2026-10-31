class ExportService {
  exportJson(filename: string, data: unknown) {
    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: "application/json",
      }
    );

    this.download(blob, filename);
  }

  exportText(filename: string, text: string) {
    const blob = new Blob([text], {
      type: "text/plain",
    });

    this.download(blob, filename);
  }

  exportCSV(
    filename: string,
    rows: Record<string, unknown>[]
  ) {
    if (!rows.length) return;

    const headers = Object.keys(rows[0]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        headers
          .map((header) => `"${row[header] ?? ""}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    this.download(blob, filename);
  }

  private download(
    blob: Blob,
    filename: string
  ) {
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    link.click();

    URL.revokeObjectURL(url);
  }
}

export default new ExportService();