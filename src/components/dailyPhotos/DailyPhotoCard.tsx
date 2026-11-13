'use client';
import { Clock, Trash2 } from 'lucide-react';
import { memo } from 'react';
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
import { Button, buttonVariants } from '@/components/ui/button';
import { useDeleteDailyPhoto } from '@/hooks/useDailyPhotos';
import { errorMessage } from '@/lib/api';
import { formatDate, formatTime } from '@/lib/date';
import type { DailyPhoto } from '@/types/api';
import EditPhoto from './EditPhoto';
import PhotoPreview from './PhotoPreview';

function DailyPhotoCard({
  data,
  priority,
}: {
  data: DailyPhoto;
  priority?: boolean;
}) {
  const deletePhoto = useDeleteDailyPhoto();
  const time = formatTime(data.date);

  return (
    <article className="bg-card text-card-foreground flex flex-col gap-3 rounded-xl border p-3 shadow-xs">
      <PhotoPreview data={data} priority={priority} />
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <time
            dateTime={data.date}
            className="flex items-center gap-2 text-sm font-medium"
          >
            {formatDate(data.date)}
            {time && (
              <span className="text-muted-foreground flex items-center gap-1 font-normal">
                <Clock className="size-3.5" />
                {time}
              </span>
            )}
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
                  className={buttonVariants({ variant: 'destructive' })}
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

// refetches keep object identity for unchanged photos, so most cards skip rendering
export default memo(DailyPhotoCard);
