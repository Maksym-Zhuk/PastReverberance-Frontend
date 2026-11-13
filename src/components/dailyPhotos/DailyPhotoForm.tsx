/* eslint-disable @next/next/no-img-element */
'use client';
import { ImagePlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type Values = { file?: File; note: string; date: Date };

// date is an ISO string, ready for the API
export type PhotoFormSubmit = { file?: File; note: string; date: string };

type Props = {
  // create needs a file, edit can optionally replace it
  mode: 'create' | 'edit';
  defaultValues?: { note: string; date: Date };
  // edit: the photo that is currently stored
  currentPhotoUrl?: string;
  pending?: boolean;
  submitLabel?: string;
  onSubmit: (values: PhotoFormSubmit) => void;
  onCancel?: () => void;
};

export default function DailyPhotoForm({
  mode,
  defaultValues,
  currentPhotoUrl,
  pending,
  submitLabel = 'Save',
  onSubmit,
  onCancel,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<Values>({
    defaultValues: defaultValues ?? { note: '', date: new Date() },
  });
  const [dragging, setDragging] = useState(false);
  // custom field (no ref): a dropped and a picked File share one setValue path
  register('file', {
    validate: (f) => mode === 'edit' || !!f || 'Please choose a photo',
  });

  const picked = watch('file');
  const preview = useMemo(
    () => (picked ? URL.createObjectURL(picked) : null),
    [picked],
  );
  useEffect(
    () => () => void (preview && URL.revokeObjectURL(preview)),
    [preview],
  );
  const shown = preview ?? currentPhotoUrl;

  const pick = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('file', { message: 'Only image files are allowed' });
      return;
    }
    clearErrors('file');
    setValue('file', file, { shouldDirty: true });
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit((v) =>
        onSubmit({
          file: v.file,
          note: v.note.trim(),
          date: v.date.toISOString(),
        }),
      )}
      className="flex flex-col gap-4"
    >
      <div className="grid gap-2">
        <Label>Photo</Label>
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            pick(e.dataTransfer.files[0]);
          }}
          className={cn(
            'group focus-within:ring-ring/50 relative flex aspect-video w-full sm:aspect-[2/1] cursor-pointer items-center justify-center overflow-hidden rounded-lg border-2 border-dashed transition-colors focus-within:ring-[3px]',
            dragging
              ? 'border-primary bg-accent'
              : 'border-input hover:bg-accent/50',
            errors.file && 'border-destructive',
          )}
        >
          <input
            type="file"
            accept="image/*"
            aria-label="Photo"
            className="sr-only"
            onChange={(e) => {
              pick(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
          {shown ? (
            <>
              <img
                src={shown}
                alt="Selected photo preview"
                className="size-full object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                Click or drop to replace
              </span>
            </>
          ) : (
            <span className="text-muted-foreground flex flex-col items-center gap-2 text-sm">
              <ImagePlus className="size-8" />
              Drop a photo here or click to choose
            </span>
          )}
        </label>
        {errors.file && (
          <p className="text-destructive text-sm">{errors.file.message}</p>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="photo-note">Note</Label>
        <Textarea
          id="photo-note"
          placeholder="Type your note here."
          maxLength={500}
          className="h-24 resize-none"
          {...register('note')}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="photo-date">Date</Label>
        <Controller
          control={control}
          name="date"
          render={({ field }) => (
            <DateTimePicker
              id="photo-date"
              value={field.value}
              onChange={field.onChange}
              max={new Date()}
            />
          )}
        />
      </div>

      <DialogFooter className="pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
