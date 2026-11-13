import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { ReactElement } from 'react';
import { vi } from 'vitest';

export function renderWithQuery(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
}

type Reply = { status?: number; body?: unknown };

export function stubFetch(
  handler: (url: string, init?: RequestInit) => Reply | Promise<Reply>,
) {
  const fn = vi.fn(async (url: string, init?: RequestInit) => {
    const { status = 200, body } = await handler(url, init);
    return new Response(
      status === 204 || body === undefined ? null : JSON.stringify(body),
      { status, headers: { 'Content-Type': 'application/json' } },
    );
  });
  vi.stubGlobal('fetch', fn);
  return fn;
}
