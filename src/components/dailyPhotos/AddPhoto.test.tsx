import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithQuery, stubFetch } from '@/test/utils';
import AddPhoto from './AddPhoto';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const open = async () => {
  renderWithQuery(<AddPhoto />);
  await userEvent.click(screen.getByRole('button', { name: 'Add photo' }));
  await screen.findByText("Add today's photo");
  await screen.findByLabelText('Photo', {}, { timeout: 5000 }); // lazy chunk, slow on a cold import
};

describe('Add photo dialog', () => {
  it('does not call the API without a file', async () => {
    const fetchMock = stubFetch(() => ({ body: {} }));
    await open();
    await userEvent.click(screen.getByRole('button', { name: 'Upload' }));

    expect(
      await screen.findByText('Please choose a photo'),
    ).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends one multipart POST with file, note and date, then closes', async () => {
    const fetchMock = stubFetch(() => ({ status: 201, body: { id: 1 } }));
    vi.stubGlobal(
      'URL',
      Object.assign(URL, {
        createObjectURL: () => 'blob:x',
        revokeObjectURL: () => {},
      }),
    );
    await open();

    await userEvent.upload(
      screen.getByLabelText('Photo'),
      new File(['img'], 'a.png', { type: 'image/png' }),
    );
    await userEvent.type(screen.getByLabelText('Note'), 'my note');
    await userEvent.click(screen.getByRole('button', { name: 'Upload' }));

    await waitFor(() =>
      expect(screen.queryByText("Add today's photo")).not.toBeInTheDocument(),
    );
    const posts = fetchMock.mock.calls.filter(
      ([, i]) => (i as RequestInit)?.method === 'POST',
    );
    expect(posts).toHaveLength(1);
    const [url, init] = posts[0] as [string, RequestInit];
    expect(url).toBe('/api/daily-photos');
    const form = init.body as FormData;
    expect((form.get('file') as File).name).toBe('a.png');
    expect(form.get('note')).toBe('my note');
    // defaults to "now", sent as an ISO instant
    expect(new Date(form.get('date') as string).toISOString()).toBe(
      form.get('date'),
    );
  });
});
