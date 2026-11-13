import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { DailyPhoto } from '@/types/api';

export const dailyPhotosKey = ['daily-photos'] as const;

export const useDailyPhotos = () =>
  useQuery({
    queryKey: dailyPhotosKey,
    queryFn: () => api<DailyPhoto[]>('/daily-photos'),
  });

function useInvalidatingMutation<V, R = unknown>(
  mutationFn: (variables: V) => Promise<R>,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: dailyPhotosKey }),
  });
}

export const useCreateDailyPhoto = () =>
  useInvalidatingMutation((v: { file: File; note?: string; date?: string }) => {
    const form = new FormData();
    form.append('note', v.note ?? '');
    if (v.date) form.append('date', v.date);
    form.append('file', v.file);
    return api<DailyPhoto>('/daily-photos', { method: 'POST', body: form });
  });

export const useUpdateDailyPhoto = () =>
  useInvalidatingMutation(
    ({ id, ...body }: { id: number; note?: string; date?: string }) =>
      api<DailyPhoto>(`/daily-photos/${id}`, { method: 'PATCH', body }),
  );

export const useDeleteDailyPhoto = () =>
  useInvalidatingMutation((id: number) =>
    api(`/daily-photos/${id}`, { method: 'DELETE' }),
  );
