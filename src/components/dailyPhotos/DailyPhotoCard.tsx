'use client';
<<<<<<< Updated upstream
import { DailyPhoto } from '@/generated/graphql';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { DELETEDAILYPHOTO, GETDAILYPHOTO } from '@/graphql/dailyPhoto';
import UpdateDailyPhotoDialog from './UpdateDailyPhoto/UpdateDailyPhotoDialog';
import UpdateDailyPhotoDrawer from './UpdateDailyPhoto/UpdateDailyPhotoDrawer';

export default function DailyPhotoCard({ data }: { data: DailyPhoto }) {
  const [deleteDailyPhoto] = useMutation(DELETEDAILYPHOTO, {
    refetchQueries: [{ query: GETDAILYPHOTO }],
  });

  const handleDelete = () => {
    deleteDailyPhoto({
      variables: {
        input: {
          id: data.id,
        },
      },
    });
  };
=======
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
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
        <div className="w-2/10 flex flex-col justify-end items-end gap-3">
          <UpdateDailyPhotoDialog data={data} />
          <UpdateDailyPhotoDrawer data={data} />
          <Button
            variant={'destructive'}
            className="cursor-pointer"
            onClick={handleDelete}
          >
            <Trash2 />
          </Button>
=======
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
>>>>>>> Stashed changes
        </div>
      </div>
    </article>
  );
}
