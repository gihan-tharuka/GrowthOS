import { getAccessToken } from "./auth-token";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiRequestOptions = RequestInit & {
  token?: string | null;
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getErrorMessage(body: unknown) {
  if (!body || typeof body !== "object") {
    return "Something went wrong.";
  }

  const maybeMessage = (body as { message?: unknown }).message;

  if (Array.isArray(maybeMessage)) {
    return maybeMessage.join(" ");
  }

  if (typeof maybeMessage === "string") {
    return maybeMessage;
  }

  return "Something went wrong.";
}

function getApiUrl() {
  if (!API_URL) {
    throw new ApiError("API base URL is not configured.", 500);
  }

  return API_URL.replace(/\/$/, "");
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(`${getApiUrl()}${path}`, {
    ...options,
    headers,
  });

  const text = await response.text();
  const body = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    throw new ApiError(getErrorMessage(body), response.status);
  }

  return body as T;
}

export function authenticatedApiRequest<T>(path: string, options: RequestInit = {}) {
  const token = getAccessToken();

  if (!token) {
    throw new ApiError("You need to log in to continue.", 401);
  }

  return apiRequest<T>(path, {
    ...options,
    token,
  });
}
