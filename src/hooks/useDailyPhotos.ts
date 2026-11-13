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
    ({
      id,
      ...v
    }: {
      id: number;
      note?: string;
      date?: string;
      file?: File;
    }) => {
      const form = new FormData();
      if (v.note !== undefined) form.append('note', v.note);
      if (v.date) form.append('date', v.date);
      if (v.file) form.append('file', v.file);
      return api<DailyPhoto>(`/daily-photos/${id}`, {
        method: 'PATCH',
        body: form,
      });
    },
  );

// the card disappears immediately; rolled back if the server refuses
export const useDeleteDailyPhoto = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      api(`/daily-photos/${id}`, { method: 'DELETE' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: dailyPhotosKey });
      const prev = queryClient.getQueryData<DailyPhoto[]>(dailyPhotosKey);
      queryClient.setQueryData<DailyPhoto[]>(dailyPhotosKey, (old) =>
        old?.filter((p) => p.id !== id),
      );
      return { prev };
    },
    onError: (_e, _id, ctx) =>
      queryClient.setQueryData(dailyPhotosKey, ctx?.prev),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: dailyPhotosKey }),
  });
};
