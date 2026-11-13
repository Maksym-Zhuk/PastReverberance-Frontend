'use client';
<<<<<<< Updated upstream
import { DailyPhoto } from '@/generated/graphql';
import { GETDAILYPHOTO } from '@/graphql/dailyPhoto';
import { useQuery } from '@apollo/client';
=======
import { ImagePlus } from 'lucide-react';
import { useDailyPhotos } from '@/hooks/useDailyPhotos';
>>>>>>> Stashed changes
import DailyPhotoCard from './DailyPhotoCard';

const grid =
  'grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:p-6 xl:grid-cols-3 2xl:grid-cols-4';

export default function DailyPhotos() {
  const { data, loading, error } = useQuery(GETDAILYPHOTO, {
    pollInterval: 5000,
  });

<<<<<<< Updated upstream
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="w-full flex flex-wrap justify-center gap-4 py-5">
      {data.getDailyPhotos.map((dailyPhoto: DailyPhoto) => (
        <DailyPhotoCard key={dailyPhoto.id} data={dailyPhoto} />
=======
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
>>>>>>> Stashed changes
      ))}
    </div>
  );
}
