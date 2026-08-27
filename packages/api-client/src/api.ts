let apiBaseUrl = "http://localhost:3000";

export function configureApiClient(baseUrl: string) {
  apiBaseUrl = baseUrl;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage =
      errorData.message || `Błąd serwera (${response.status})`;
    throw new ApiError(errorMessage, response.status);
  }

  return response.json();
}
