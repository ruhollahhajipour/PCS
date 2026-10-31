export function capitalize(value: string): string {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function titleCase(value: string): string {
  if (!value) return "";

  return value
    .toLowerCase()
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");
}

export function truncate(
  value: string,
  length = 50
): string {
  if (!value) return "";

  if (value.length <= length) {
    return value;
  }

  return `${value.substring(0, length)}...`;
}

export function isNullOrEmpty(
  value?: string | null
): boolean {
  return (
    value === undefined ||
    value === null ||
    value.trim() === ""
  );
}

export function generateCode(
  prefix: string
): string {
  const random = Math.floor(
    Math.random() * 100000
  );

  return `${prefix}-${random}`;
}