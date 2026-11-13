'use client';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDeleteDailyPhoto } from '@/hooks/useDailyPhotos';
import { errorMessage } from '@/lib/api';
import { formatDate } from '@/lib/date';
import type { DailyPhoto } from '@/types/api';
import EditPhoto from './EditPhoto';

export default function DailyPhotoCard({ data }: { data: DailyPhoto }) {
  const deletePhoto = useDeleteDailyPhoto();

  return (
    <article className="bg-card text-card-foreground flex flex-col gap-3 rounded-xl border p-3 shadow-xs">
      <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={data.photoUrl}
          alt="Daily photo"
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <time className="text-muted-foreground text-xs font-medium">
            {formatDate(data.date)}
          </time>
          {data.note && <p className="mt-1 text-sm break-words">{data.note}</p>}
        </div>
        <div className="flex shrink-0 gap-1">
          <EditPhoto data={data} />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Delete photo"
                className="text-destructive hover:text-destructive"
                disabled={deletePhoto.isPending}
              >
                <Trash2 />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this photo?</AlertDialogTitle>
                <AlertDialogDescription>
                  This can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    deletePhoto.mutate(data.id, {
                      onError: (err) => toast.error(errorMessage(err)),
                    })
                  }
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </article>
  );
}
