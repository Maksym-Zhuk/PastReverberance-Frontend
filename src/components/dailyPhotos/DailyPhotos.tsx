'use client';
import { ImagePlus } from 'lucide-react';
import { useDailyPhotos } from '@/hooks/useDailyPhotos';
import DailyPhotoCard from './DailyPhotoCard';

const grid =
  'grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:p-6 xl:grid-cols-3 2xl:grid-cols-4';

export default function DailyPhotos() {
  const { data, isLoading, error } = useDailyPhotos();

  if (isLoading)
    return (
      <div className={grid} aria-busy="true" aria-label="Loading photos">
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className="bg-muted aspect-[4/3] animate-pulse rounded-xl"
          />
        ))}
      </div>
    );

  if (error)
    return (
      <p role="alert" className="text-destructive p-6 text-center">
        Error: {error.message}
      </p>
    );

  if (!data?.length)
    return (
      <div className="text-muted-foreground flex flex-col items-center gap-3 px-6 py-24 text-center">
        <ImagePlus className="size-12" />
        <p className="text-foreground text-lg font-medium">No photos yet</p>
        <p className="text-sm">Tap the + button to add your first photo.</p>
      </div>
    );

  return (
    <div className={grid}>
      {data.map((photo) => (
        <DailyPhotoCard key={photo.id} data={photo} />
      ))}
    </div>
  );
}
