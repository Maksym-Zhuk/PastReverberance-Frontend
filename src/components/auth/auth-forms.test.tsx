import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderWithQuery, stubFetch } from '@/test/utils';
import { LoginForm } from './login-form';
import { RegisterForm } from './register-form';

const push = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh: vi.fn() }),
}));

beforeEach(() => push.mockClear());

describe('LoginForm', () => {
  it('posts credentials and redirects to / on success', async () => {
    const fetchMock = stubFetch(() => ({ body: { id: 1 } }));
    renderWithQuery(<LoginForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Str0ng!Passw0rd');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/auth/login');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body as string)).toEqual({
      email: 'john@example.com',
      password: 'Str0ng!Passw0rd',
    });
  });

  it('shows the server error and does not redirect', async () => {
    stubFetch(() => ({
      status: 401,
      body: { message: 'Incorrect password!' },
    }));
    renderWithQuery(<LoginForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Str0ng!Passw0rd');
    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Incorrect password!',
    );
    expect(push).not.toHaveBeenCalled();
  });

  it('requires both fields without calling the API', async () => {
    const fetchMock = stubFetch(() => ({ body: {} }));
    renderWithQuery(<LoginForm />);

    await userEvent.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('toggles password visibility', async () => {
    renderWithQuery(<LoginForm />);
    const input = screen.getByLabelText('Password');
    expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(
      screen.getByRole('button', { name: 'Show password' }),
    );
    expect(input).toHaveAttribute('type', 'text');

    await userEvent.click(
      screen.getByRole('button', { name: 'Hide password' }),
    );
    expect(input).toHaveAttribute('type', 'password');
  });
});

describe('RegisterForm', () => {
  const fill = async () => {
    await userEvent.type(screen.getByLabelText('First name'), 'John');
    await userEvent.type(screen.getByLabelText('Last name'), 'Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'Str0ng!Passw0rd');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));
  };

  it('posts email, password and nested profile, then redirects', async () => {
    const fetchMock = stubFetch(() => ({ status: 201, body: { id: 1 } }));
    renderWithQuery(<RegisterForm />);
    await fill();

    await waitFor(() => expect(push).toHaveBeenCalledWith('/'));
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/auth/register');
    expect(JSON.parse(init.body as string)).toEqual({
      email: 'john@example.com',
      password: 'Str0ng!Passw0rd',
      profile: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('rejects a weak password client-side without calling the API', async () => {
    const fetchMock = stubFetch(() => ({ body: {} }));
    renderWithQuery(<RegisterForm />);
    await userEvent.type(screen.getByLabelText('First name'), 'John');
    await userEvent.type(screen.getByLabelText('Last name'), 'Doe');
    await userEvent.type(screen.getByLabelText('Email'), 'john@example.com');
    await userEvent.type(screen.getByLabelText('Password'), 'password1');
    await userEvent.click(screen.getByRole('button', { name: 'Register' }));

    expect(
      await screen.findAllByText(/uppercase letter, a lowercase letter/),
    ).not.toHaveLength(0);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('shows the conflict error from the server', async () => {
    stubFetch(() => ({
      status: 409,
      body: { message: 'Email already in use' },
    }));
    renderWithQuery(<RegisterForm />);
    await fill();

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Email already in use',
    );
    expect(push).not.toHaveBeenCalled();
  });
});
