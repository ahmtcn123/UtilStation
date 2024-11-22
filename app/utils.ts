export function toSnakeCase(str: string): string {
  return str.replaceAll(" ", "-").toLowerCase();
}
