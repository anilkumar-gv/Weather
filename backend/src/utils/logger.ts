export function logInfo(message: string): void {
  console.info(message);
}

export function logError(message: string, error?: unknown): void {
  console.error(message, error);
}
