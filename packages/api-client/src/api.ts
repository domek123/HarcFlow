type AccessTokenProvider = () => Promise<string | null>;

let apiBaseUrl = "http://localhost:3000";
let accessTokenProvider: AccessTokenProvider | undefined;

export function configureApiClient(
  baseUrl: string,
  tokenProvider?: AccessTokenProvider,
) {
  apiBaseUrl = baseUrl;
  accessTokenProvider = tokenProvider;
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
  const accessToken = accessTokenProvider ? await accessTokenProvider() : null;
  const headers = new Headers(options?.headers);
  headers.set("Content-Type", "application/json");
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${apiBaseUrl}${endpoint}`, {
    headers,
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
