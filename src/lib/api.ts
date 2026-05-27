/**
 * Cliente HTTP para a API do DevPrep.
 *
 * - Injeta Bearer token automaticamente.
 * - Em 401, tenta rotacionar o refresh token **uma vez** e refaz a requisição.
 * - Lança ApiError com status e payload quando algo der errado.
 */

import type { TokenPair } from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const ACCESS_KEY = "devprep.access_token";
const REFRESH_KEY = "devprep.refresh_token";

export class ApiError extends Error {
  status: number;
  code?: string;
  payload?: unknown;

  constructor(message: string, status: number, code?: string, payload?: unknown) {
    super(message);
    this.status = status;
    this.code = code;
    this.payload = payload;
  }
}

// ---- Token storage helpers ----

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens: TokenPair): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_KEY, tokens.access_token);
  localStorage.setItem(REFRESH_KEY, tokens.refresh_token);
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// ---- Internal fetch with refresh retry ----

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  query?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
  skipAuth?: boolean;
}

function buildUrl(path: string, query?: RequestOptions["query"]): string {
  const url = new URL(`${API_URL}${path}`);
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== "") {
        url.searchParams.set(k, String(v));
      }
    }
  }
  return url.toString();
}

let refreshPromise: Promise<boolean> | null = null;

async function tryRefresh(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!res.ok) {
        clearTokens();
        return false;
      }
      const tokens = (await res.json()) as TokenPair;
      setTokens(tokens);
      return true;
    } catch {
      clearTokens();
      return false;
    } finally {
      // libera a próxima tentativa de refresh após alguns ms
      setTimeout(() => {
        refreshPromise = null;
      }, 50);
    }
  })();

  return refreshPromise;
}

async function parseErrorBody(
  res: Response
): Promise<{ message: string; code?: string; payload?: unknown }> {
  try {
    const data = await res.json();
    const detail = data?.detail;
    if (typeof detail === "string") {
      return { message: detail, payload: data };
    }
    if (detail && typeof detail === "object") {
      return {
        message: detail.message || res.statusText,
        code: detail.code,
        payload: data,
      };
    }
    return { message: res.statusText, payload: data };
  } catch {
    return { message: res.statusText };
  }
}

async function doFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, signal, skipAuth } = opts;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (!skipAuth) {
    const token = getAccessToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const url = buildUrl(path, query);
  let res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  // 401 + refresh available → tenta 1 vez
  if (res.status === 401 && !skipAuth && getRefreshToken()) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      const newToken = getAccessToken();
      if (newToken) headers["Authorization"] = `Bearer ${newToken}`;
      res = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
      });
    }
  }

  if (res.status === 204) {
    return undefined as T;
  }

  if (!res.ok) {
    const { message, code, payload } = await parseErrorBody(res);
    throw new ApiError(message, res.status, code, payload);
  }

  return (await res.json()) as T;
}

// ---- API pública (verbose API funcional) ----

export const api = {
  get: <T>(path: string, query?: RequestOptions["query"], signal?: AbortSignal) =>
    doFetch<T>(path, { method: "GET", query, signal }),

  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    doFetch<T>(path, { method: "POST", body, ...opts }),

  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    doFetch<T>(path, { method: "PATCH", body, ...opts }),

  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    doFetch<T>(path, { method: "PUT", body, ...opts }),

  delete: <T = void>(path: string, opts?: RequestOptions) =>
    doFetch<T>(path, { method: "DELETE", ...opts }),
};
