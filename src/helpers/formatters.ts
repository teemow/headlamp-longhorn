/**
 * Formats bytes into a human-readable string (KiB, MiB, GiB, TiB).
 * @param bytes The number of bytes.
 * @param decimals The number of decimal places to display (default: 2).
 * @returns A formatted string representing the size.
 */
export function formatBytes(bytes: number | string | undefined | null, decimals = 2): string {
  if (bytes === undefined || bytes === null) {
    return '-';
  }

  const bytesNum = typeof bytes === 'string' ? parseFloat(bytes) : bytes;

  if (isNaN(bytesNum) || bytesNum === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  const i = Math.floor(Math.log(bytesNum) / Math.log(k));

  // Ensure the index is within the bounds of the sizes array
  const unitIndex = i < sizes.length ? i : sizes.length - 1;
  const divisor = Math.pow(k, unitIndex);

  return `${parseFloat((bytesNum / divisor).toFixed(dm))} ${sizes[unitIndex]}`;
}

// Add other formatting functions as needed (e.g., for dates, states) 