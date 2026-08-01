export function fileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];

  const index = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  return `${(
    bytes / Math.pow(1024, index)
  ).toFixed(2)} ${units[index]}`;
}

export function fileExtension(
  filename: string
): string {
  const index = filename.lastIndexOf(".");

  if (index < 0) return "";

  return filename.substring(index + 1).toUpperCase();
}

export function isImage(
  filename: string
): boolean {
  const ext = fileExtension(filename);

  return [
    "PNG",
    "JPG",
    "JPEG",
    "WEBP",
    "GIF",
    "SVG",
  ].includes(ext);
}

export function isPDF(
  filename: string
): boolean {
  return fileExtension(filename) === "PDF";
}

export function downloadBlob(
  blob: Blob,
  filename: string
) {
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");

  a.href = url;
  a.download = filename;

  document.body.appendChild(a);

  a.click();

  a.remove();

  URL.revokeObjectURL(url);
}