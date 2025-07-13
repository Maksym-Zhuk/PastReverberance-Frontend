import DailyPhotos from '@/components/dailyPhotos/DailyPhotos';
import Dialog from '@/components/dailyPhotos/Dialog';

export default function DailyPhotosPage() {
  return (
    <div className="w-full min-h-[100dvh]">
      <DailyPhotos />
      <div className="lg:flex hidden fixed bottom-0 right-0 mb-5 mr-5">
        <Dialog />
      </div>
    </div>
  );
}
