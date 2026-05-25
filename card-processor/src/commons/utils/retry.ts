export interface RetryOptions {
  delays: number[];
  onRetry?: (error: Error, attemptNumber: number, nextDelayMs: number) => void;
}

export async function retryWithBackoff<T>(
  fn: (attempt: number) => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= options.delays.length; attempt++) {
    try {
      return await fn(attempt);
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < options.delays.length) {
        const delayMs = options.delays[attempt];
        options.onRetry?.(lastError, attempt + 1, delayMs);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }

  throw lastError;
}
