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
import type { DailyPhoto } from '@/types/api';
import DailyPhotoForm from './DailyPhotoForm';

export default function EditPhoto({ data }: { data: DailyPhoto }) {
  const [open, setOpen] = useState(false);
  const update = useUpdateDailyPhoto();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Edit photo">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit photo</DialogTitle>
          <DialogDescription>Change the note or the date.</DialogDescription>
        </DialogHeader>
        <DailyPhotoForm
          mode="edit"
          defaultValues={{
            note: data.note ?? '',
            date: data.date.slice(0, 10),
          }}
          pending={update.isPending}
          onCancel={() => setOpen(false)}
          onSubmit={async ({ note, date }) => {
            try {
              await update.mutateAsync({ id: data.id, note, date });
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
