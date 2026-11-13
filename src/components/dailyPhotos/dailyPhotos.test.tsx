/* eslint-disable @next/next/no-img-element */
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { DailyPhoto } from '@/types/api';
import { renderWithQuery, stubFetch } from '@/test/utils';
import DailyPhotoCard from './DailyPhotoCard';
import DailyPhotos from './DailyPhotos';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

const photo = (id: number, note: string): DailyPhoto => ({
  id,
  userId: 1,
  photoUrl: `https://cdn/p${id}.png`,
  note,
  date: '2026-01-02',
});

describe('DailyPhotos', () => {
  it('shows loading, then the list', async () => {
    stubFetch(() => ({ body: [photo(1, 'first'), photo(2, 'second')] }));
    renderWithQuery(<DailyPhotos />);

    expect(screen.getByLabelText('Loading photos')).toBeInTheDocument();
    expect(await screen.findByText('first')).toBeInTheDocument();
    expect(screen.getByText('second')).toBeInTheDocument();
    expect(screen.getAllByAltText('Daily photo')).toHaveLength(2);
  });

  it('shows an empty state when there are no photos', async () => {
    stubFetch(() => ({ body: [] }));
    renderWithQuery(<DailyPhotos />);
    expect(await screen.findByText('No photos yet')).toBeInTheDocument();
  });

  it('shows the server error', async () => {
    stubFetch(() => ({ status: 500, body: { message: 'Boom' } }));
    renderWithQuery(<DailyPhotos />);
    expect(await screen.findByText('Error: Boom')).toBeInTheDocument();
  });
});

describe('DailyPhotoCard delete', () => {
  it('sends DELETE and refetches the list', async () => {
    let photos = [photo(7, 'bye')];
    const fetchMock = stubFetch((url, init) => {
      if (init?.method === 'DELETE') {
        photos = [];
        return { status: 204 };
      }
      return { body: photos };
    });

    renderWithQuery(<DailyPhotos />);
    await screen.findByText('bye');

    await userEvent.click(screen.getByRole('button', { name: 'Delete photo' }));
    await userEvent.click(
      await screen.findByRole('button', { name: 'Delete' }),
    );

    await waitFor(() =>
      expect(screen.queryByText('bye')).not.toBeInTheDocument(),
    );
    const calls = fetchMock.mock.calls.map(([u, i]) => [
      u,
      (i as RequestInit)?.method ?? 'GET',
    ]);
    expect(calls).toContainEqual(['/api/daily-photos/7', 'DELETE']);
    expect(calls.filter(([, m]) => m === 'GET')).toHaveLength(2);
  });

  it('renders note and photo', () => {
    stubFetch(() => ({ body: [] }));
    renderWithQuery(<DailyPhotoCard data={photo(1, 'hello')} />);
    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByAltText('Daily photo')).toHaveAttribute(
      'src',
      'https://cdn/p1.png',
    );
  });
});
