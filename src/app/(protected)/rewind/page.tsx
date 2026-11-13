'use client';
import DailyPhotoCircle from '@/components/rewind/DailyPhotoCircle';
import { Button } from '@/components/ui/button';
import { useDailyPhotos } from '@/hooks/useDailyPhotos';
import { formatDate } from '@/lib/date';
import { ImagePlus, Maximize, Minimize, Pause, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const SLIDE_MS = 3000;
const DOT = 20; // px, keeps the progress bar aligned with the dot centers

export default function RewindPage() {
  const { data, isLoading, error } = useDailyPhotos();
  const [index, setIndex] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);

  // API returns newest first; a rewind plays oldest -> newest
  const photos = useMemo(() => [...(data ?? [])].reverse(), [data]);
  const count = photos.length;
  const safeIndex = Math.min(index, Math.max(count - 1, 0));
  const photo = photos[safeIndex];

  useEffect(() => {
    if (!isPlay || count < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), SLIDE_MS);
    return () => clearInterval(id);
  }, [isPlay, count]);

  useEffect(() => {
    if (!fullScreen) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setFullScreen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [fullScreen]);

  if (isLoading)
    return <div className="bg-muted m-4 h-[60dvh] animate-pulse rounded-xl" />;
  if (error)
    return (
      <p role="alert" className="text-destructive p-6 text-center">
        Error: {error.message}
      </p>
    );
  if (!photo)
    return (
      <div className="text-muted-foreground flex min-h-[70dvh] flex-col items-center justify-center gap-3 px-6 text-center">
        <ImagePlus className="size-12" />
        <p className="text-foreground text-lg font-medium">
          Nothing to rewind yet
        </p>
        <Button asChild>
          <Link href="/">Add your first photo</Link>
        </Button>
      </div>
    );

  const progress = count > 1 ? safeIndex / (count - 1) : 1;

  return (
    <div
      className={`bg-background flex flex-col gap-4 p-4 lg:p-6 ${
        fullScreen
          ? 'fixed inset-0 z-50'
          : 'min-h-[calc(100dvh-5rem)] lg:min-h-[100dvh]'
      }`}
    >
      <div className="bg-muted relative min-h-[40dvh] flex-1 overflow-hidden rounded-xl">
        <Image
          key={photo.id}
          src={photo.photoUrl}
          alt={photo.note || `Photo from ${formatDate(photo.date)}`}
          fill
          priority
          sizes="100vw"
          className="animate-in fade-in object-contain duration-500"
        />
        <button
          type="button"
          onClick={() => setIsPlay((p) => !p)}
          aria-label={isPlay ? 'Pause rewind' : 'Play rewind'}
          className="absolute inset-0 flex cursor-pointer items-center justify-center outline-none"
        >
          <span
            className={`bg-primary text-primary-foreground flex size-16 items-center justify-center rounded-full shadow-lg transition-opacity duration-300 ${
              isPlay ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {isPlay ? <Pause /> : <Play />}
          </span>
        </button>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
          <p className="text-sm font-medium">{formatDate(photo.date)}</p>
          {photo.note && <p className="line-clamp-2 text-sm">{photo.note}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1 overflow-x-auto py-2">
          <div className="relative flex w-max min-w-full items-center justify-between gap-3">
            <div className="bg-muted absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" />
            <div
              className="bg-primary absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full transition-all duration-500"
              style={{
                width: `calc(${DOT / 2}px + (100% - ${DOT}px) * ${progress})`,
              }}
            />
            {photos.map((p, i) => (
              <div key={p.id} className="relative z-10">
                <DailyPhotoCircle
                  data={p}
                  reached={i <= safeIndex}
                  current={i === safeIndex}
                  onSelect={() => setIndex(i)}
                />
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setFullScreen((f) => !f)}
          aria-label={fullScreen ? 'Exit full screen' : 'Full screen'}
        >
          {fullScreen ? <Minimize /> : <Maximize />}
        </Button>
      </div>
    </div>
  );
}
