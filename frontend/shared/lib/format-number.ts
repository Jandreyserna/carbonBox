const numberFormatter = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 });

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB'];

export function formatNumber(value: number | null | undefined): string {
  return value === null || value === undefined ? '-' : numberFormatter.format(value);
}

export function formatFileSize(bytes: number): string {
  const exponent = Math.min(
    Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(1024)),
    FILE_SIZE_UNITS.length - 1,
  );
  return `${formatNumber(bytes / 1024 ** exponent)} ${FILE_SIZE_UNITS[exponent]}`;
}
