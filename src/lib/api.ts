export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiInit = Omit<RequestInit, 'body'> & { body?: unknown };

let refreshing: Promise<boolean> | null = null;

// one in-flight refresh shared by all concurrent 401s
function refreshSession() {
  refreshing ??= fetch('/api/auth/refresh', {
    method: 'POST',
    credentials: 'include',
  })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

async function endSession() {
  // clear cookies first, otherwise the guest middleware bounces /auth/login back to /
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  }).catch(() => null);
  if (typeof window !== 'undefined') window.location.assign('/auth/login');
}

export async function api<T = void>(
  path: string,
  { body, headers, ...init }: ApiInit = {},
  retried = false,
): Promise<T> {
  const isForm = body instanceof FormData;
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    ...init,
    headers: {
      ...(body !== undefined && !isForm
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...headers,
    },
    body:
      body === undefined || isForm || typeof body === 'string'
        ? (body as BodyInit | undefined)
        : JSON.stringify(body),
  });

  if (res.status === 401 && !path.startsWith('/auth/')) {
    if (!retried && (await refreshSession())) {
      return api<T>(path, { body, headers, ...init }, true);
    }
    await endSession();
  }

  if (!res.ok) {
    const payload = await res.json().catch(() => null);
    const message = Array.isArray(payload?.message)
      ? payload.message.join(', ')
      : (payload?.message ?? res.statusText ?? 'Request failed');
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const errorMessage = (err: unknown) =>
  err instanceof Error ? err.message : 'Something went wrong';
