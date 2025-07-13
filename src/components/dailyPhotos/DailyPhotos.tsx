'use client';
import { DailyPhoto } from '@/generated/graphql';
import { GETDAILYPHOTO } from '@/graphql/dailyPhoto';
import { useQuery } from '@apollo/client';
import DailyPhotoCard from './DailyPhotoCard';

export default function DailyPhotos() {
  const { data, loading, error } = useQuery(GETDAILYPHOTO, {
    pollInterval: 5000,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="w-full flex flex-wrap justify-center gap-4 py-5">
      {data.getDailyPhotos.map((dailyPhoto: DailyPhoto) => (
        <DailyPhotoCard key={dailyPhoto.id} data={dailyPhoto} />
      ))}
    </div>
  );
}
