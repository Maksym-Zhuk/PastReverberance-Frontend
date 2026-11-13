/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { todayLocal } from '@/lib/date';

type Values = { file?: FileList; note: string; date: string };

export type PhotoFormSubmit = { file?: File; note: string; date: string };

type Props = {
  // create needs a file, edit only changes note/date
  mode: 'create' | 'edit';
  defaultValues?: { note: string; date: string };
  pending?: boolean;
  submitLabel?: string;
  onSubmit: (values: PhotoFormSubmit) => void;
  onCancel?: () => void;
};

export default function DailyPhotoForm({
  mode,
  defaultValues,
  pending,
  submitLabel = 'Save',
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: defaultValues ?? { note: '', date: todayLocal() },
  });

  const picked = watch('file')?.[0];
  const preview = useMemo(
    () => (picked ? URL.createObjectURL(picked) : null),
    [picked],
  );
  useEffect(
    () => () => void (preview && URL.revokeObjectURL(preview)),
    [preview],
  );

  return (
    <form
      noValidate
      onSubmit={handleSubmit((v) =>
        onSubmit({ file: v.file?.[0], note: v.note.trim(), date: v.date }),
      )}
      className="flex flex-col gap-4"
    >
      {mode === 'create' && (
        <div className="grid gap-2">
          <Label htmlFor="photo-file">Photo</Label>
          <Input
            id="photo-file"
            type="file"
            accept="image/*"
            aria-invalid={!!errors.file}
            {...register('file', {
              validate: (f) => !!f?.length || 'Please choose a photo',
            })}
          />
          {errors.file && (
            <p className="text-destructive text-sm">{errors.file.message}</p>
          )}
          {preview && (
            <img
              src={preview}
              alt="Selected photo preview"
              className="aspect-video w-full rounded-lg object-cover"
            />
          )}
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="photo-note">Note</Label>
        <Textarea
          id="photo-note"
          placeholder="Type your note here."
          maxLength={500}
          className="h-28 resize-none"
          {...register('note')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="photo-date">Date</Label>
        <Input
          id="photo-date"
          type="date"
          max={todayLocal()}
          aria-invalid={!!errors.date}
          {...register('date', { required: 'Please pick a date' })}
        />
        {errors.date && (
          <p className="text-destructive text-sm">{errors.date.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
