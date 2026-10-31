class ImportService {
  async importJson<T>(file: File): Promise<T> {
    const text = await file.text();

    return JSON.parse(text) as T;
  }

  async importText(file: File): Promise<string> {
    return await file.text();
  }

  async importCSV(file: File): Promise<string[][]> {
    const text = await file.text();

    return text
      .split("\n")
      .filter((row) => row.trim() !== "")
      .map((row) =>
        row
          .split(",")
          .map((item) =>
            item.replace(/^"|"$/g, "").trim()
          )
      );
  }
}

export default new ImportService();