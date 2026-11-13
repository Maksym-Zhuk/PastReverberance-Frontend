import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { User } from '@/types/api';

export const meKey = ['me'] as const;

type Credentials = { email: string; password: string };

// a new session must never see the previous user's cached data
function useSessionMutation<V>(path: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: V) => api<User>(path, { method: 'POST', body }),
    onSuccess: (user) => {
      queryClient.clear();
      queryClient.setQueryData(meKey, user);
    },
  });
}

export const useLogin = () => useSessionMutation<Credentials>('/auth/login');

export const useRegister = () =>
  useSessionMutation<
    Credentials & { profile: { firstName: string; lastName: string } }
  >('/auth/register');

export const useMe = () =>
  useQuery({ queryKey: meKey, queryFn: () => api<User>('/users/me') });

export const useUpdateMe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      email?: string;
      firstName?: string;
      lastName?: string;
      description?: string;
    }) => api<User>('/users/me', { method: 'PATCH', body }),
    onSuccess: (user) => queryClient.setQueryData(meKey, user),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api('/auth/logout', { method: 'POST' }),
    onSettled: () => {
      queryClient.clear();
      window.location.assign('/auth/login');
    },
  });
};

export const useDeleteMe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => api('/users/me', { method: 'DELETE' }),
    onSuccess: async () => {
      queryClient.clear();
      await api('/auth/logout', { method: 'POST' }).catch(() => null);
      window.location.assign('/auth/login');
    },
  });
};
