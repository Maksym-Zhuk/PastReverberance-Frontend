'use client';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useUpdateDailyPhoto } from '@/hooks/useDailyPhotos';
import { errorMessage } from '@/lib/api';
import { parseDate } from '@/lib/date';
import type { DailyPhoto } from '@/types/api';
import dynamic from 'next/dynamic';

// pulls in the date picker + select only when a dialog is opened
const loadForm = () => import('./DailyPhotoForm');
const DailyPhotoForm = dynamic(loadForm);

export default function EditPhoto({ data }: { data: DailyPhoto }) {
  const [open, setOpen] = useState(false);
  const update = useUpdateDailyPhoto();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Edit photo"
          onPointerEnter={loadForm}
        >
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit photo</DialogTitle>
          <DialogDescription>
            Change the photo, the note or the date.
          </DialogDescription>
        </DialogHeader>
        <DailyPhotoForm
          mode="edit"
          currentPhotoUrl={data.photoUrl}
          defaultValues={{
            note: data.note ?? '',
            date: parseDate(data.date),
          }}
          pending={update.isPending}
          onCancel={() => setOpen(false)}
          onSubmit={async ({ file, note, date }) => {
            try {
              await update.mutateAsync({ id: data.id, note, date, file });
              setOpen(false);
            } catch (err) {
              toast.error(errorMessage(err));
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
