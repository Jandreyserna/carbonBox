export const MAX_FILE_SIZE_MB = 20;

const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export function getCsvValidationError(file: File): string | null {
  if (!file.name.toLowerCase().endsWith('.csv')) return 'Solo se permiten archivos .csv';
  if (file.size > MAX_FILE_SIZE_BYTES) return `El archivo no puede superar ${MAX_FILE_SIZE_MB} MB`;
  return null;
}
