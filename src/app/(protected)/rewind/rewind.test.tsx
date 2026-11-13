/* eslint-disable @next/next/no-img-element */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithQuery, stubFetch } from '@/test/utils';
import RewindPage from './page';

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

// API order is newest first; the page plays oldest -> newest
const photos = [3, 2, 1].map((id) => ({
  id,
  userId: 1,
  photoUrl: `https://cdn/p${id}.png`,
  note: `note ${id}`,
  date: `2026-01-0${id}T10:00:00.000Z`,
}));

const setup = async () => {
  stubFetch(() => ({ body: photos }));
  renderWithQuery(<RewindPage />);
  await screen.findByLabelText('Play rewind');
};
const current = () =>
  screen
    .getAllByRole('button', { name: /^Show photo from/ })
    .findIndex((b) => b.getAttribute('aria-current') === 'true');

describe('Rewind keyboard shortcuts', () => {
  it('arrow keys step between photos', async () => {
    await setup();
    expect(current()).toBe(0);
    await userEvent.keyboard('{ArrowRight}');
    expect(current()).toBe(1);
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(current()).toBe(2); // clamped at the end
    await userEvent.keyboard('{ArrowLeft}');
    expect(current()).toBe(1);
    await userEvent.keyboard('{Home}');
    expect(current()).toBe(0);
  });

  it('Space plays/pauses and F toggles full screen', async () => {
    await setup();
    await userEvent.keyboard(' ');
    expect(screen.getByLabelText('Pause rewind')).toBeInTheDocument();
    await userEvent.keyboard(' ');
    expect(screen.getByLabelText('Play rewind')).toBeInTheDocument();

    await userEvent.keyboard('f');
    expect(screen.getByLabelText('Exit full screen')).toBeInTheDocument();
    await userEvent.keyboard('f');
    expect(screen.getByLabelText('Full screen')).toBeInTheDocument();
  });

  it('ignores keys while typing in a field', async () => {
    await setup();
    const input = document.createElement('input');
    document.body.append(input);
    input.focus();
    await userEvent.keyboard('{ArrowRight}f ');
    expect(current()).toBe(0);
    expect(screen.getByLabelText('Full screen')).toBeInTheDocument();
    input.remove();
  });
});
