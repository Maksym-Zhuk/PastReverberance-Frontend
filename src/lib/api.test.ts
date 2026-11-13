import { describe, expect, it, vi } from 'vitest';
import { stubFetch } from '@/test/utils';
import { api, ApiError, errorMessage } from './api';

describe('api', () => {
  it('prefixes /api and sends credentials', async () => {
    const fetchMock = stubFetch(() => ({ body: [1] }));
    await expect(api('/daily-photos')).resolves.toEqual([1]);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/daily-photos',
      expect.objectContaining({ credentials: 'include' }),
    );
  });

  it('sends plain-object bodies as JSON', async () => {
    const fetchMock = stubFetch(() => ({ body: {} }));
    await api('/auth/login', { method: 'POST', body: { a: 1 } });
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.body).toBe('{"a":1}');
    expect(init.headers).toMatchObject({ 'Content-Type': 'application/json' });
    expect(init.method).toBe('POST');
  });

  it('passes FormData through without a JSON content type', async () => {
    const fetchMock = stubFetch(() => ({ body: {} }));
    const form = new FormData();
    form.append('file', new Blob(['x']), 'a.png');
    await api('/daily-photos', { method: 'POST', body: form });
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.body).toBe(form);
    expect(init.headers).not.toHaveProperty('Content-Type');
  });

  it('returns undefined for 204', async () => {
    stubFetch(() => ({ status: 204 }));
    await expect(api('/x', { method: 'DELETE' })).resolves.toBeUndefined();
  });

  it('throws ApiError with the server message', async () => {
    stubFetch(() => ({
      status: 401,
      body: { message: 'Incorrect password!' },
    }));
    const err = await api('/auth/login').catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect(err).toMatchObject({ status: 401, message: 'Incorrect password!' });
  });

  it('joins validation message arrays', async () => {
    stubFetch(() => ({
      status: 400,
      body: { message: ['email must be an email', 'bad'] },
    }));
    await expect(api('/x')).rejects.toMatchObject({
      status: 400,
      message: 'email must be an email, bad',
    });
  });

  it('refreshes once on 401 and retries the request', async () => {
    let allowed = false;
    const fetchMock = stubFetch((url) => {
      if (url === '/api/auth/refresh') {
        allowed = true;
        return { body: { accessToken: 'n' } };
      }
      return allowed ? { body: [1] } : { status: 401, body: {} };
    });
    await expect(api('/daily-photos')).resolves.toEqual([1]);
    expect(fetchMock.mock.calls.map(([u]) => u)).toEqual([
      '/api/daily-photos',
      '/api/auth/refresh',
      '/api/daily-photos',
    ]);
  });

  it('logs out and goes to /auth/login when refresh fails', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { assign });
    const fetchMock = stubFetch((url) =>
      url === '/api/auth/logout' ? { status: 204 } : { status: 401, body: {} },
    );
    await expect(api('/daily-photos')).rejects.toMatchObject({ status: 401 });
    expect(fetchMock.mock.calls.map(([u]) => u)).toContain('/api/auth/logout');
    expect(assign).toHaveBeenCalledWith('/auth/login');
  });

  it('does not try to refresh failed /auth/* calls', async () => {
    const fetchMock = stubFetch(() => ({ status: 401, body: {} }));
    await expect(api('/auth/login')).rejects.toMatchObject({ status: 401 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('errorMessage falls back for non-errors', () => {
    expect(errorMessage(new Error('boom'))).toBe('boom');
    expect(errorMessage('x')).toBe('Something went wrong');
  });
});
