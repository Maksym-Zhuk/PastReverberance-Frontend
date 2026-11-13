'use client';
import { Plus } from 'lucide-react';
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
import { useCreateDailyPhoto } from '@/hooks/useDailyPhotos';
import { errorMessage } from '@/lib/api';
import dynamic from 'next/dynamic';

// pulls in the date picker + select only when a dialog is opened
const loadForm = () => import('./DailyPhotoForm');
const DailyPhotoForm = dynamic(loadForm);

// floating button, sits above the mobile nav and in the corner on desktop
export default function AddPhoto() {
  const [open, setOpen] = useState(false);
  const create = useCreateDailyPhoto();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          aria-label="Add photo"
          onPointerEnter={loadForm}
          className="fixed right-4 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-30 size-14 rounded-full shadow-lg lg:right-8 lg:bottom-8"
        >
          <Plus className="size-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add today&apos;s photo</DialogTitle>
          <DialogDescription>
            Drop a photo, add a note and choose when it was taken.
          </DialogDescription>
        </DialogHeader>
        <DailyPhotoForm
          mode="create"
          submitLabel="Upload"
          pending={create.isPending}
          onCancel={() => setOpen(false)}
          onSubmit={async ({ file, note, date }) => {
            if (!file) return;
            try {
              await create.mutateAsync({ file, note, date });
              toast.success('Photo saved');
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
