'use client';
import DailyPhotoCircle from '@/components/rewind/DailyPhotoCircle';
import { Button } from '@/components/ui/button';
<<<<<<< Updated upstream
import { DailyPhoto } from '@/generated/graphql';
import { GETDAILYPHOTO } from '@/graphql/dailyPhoto';
import { useQuery } from '@apollo/client';
import { Expand, Maximize, Pause, Play, Settings } from 'lucide-react';
=======
import { useDailyPhotos } from '@/hooks/useDailyPhotos';
import { formatDate } from '@/lib/date';
import { ImagePlus, Maximize, Minimize, Pause, Play } from 'lucide-react';
>>>>>>> Stashed changes
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const SLIDE_MS = 3000;
const DOT = 20; // px, keeps the progress bar aligned with the dot centers

export default function RewindPage() {
<<<<<<< Updated upstream
  const { data, loading, error } = useQuery(GETDAILYPHOTO);
  const [dailyPhotoUrl, setDailyPhotoUrl] = useState<string>('');
  const [fillLine, setFillLine] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [fadeIn, setFadeIn] = useState<boolean>(true);
=======
  const { data, isLoading, error } = useDailyPhotos();
  const [index, setIndex] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
>>>>>>> Stashed changes

  // API returns newest first; a rewind plays oldest -> newest
  const photos = useMemo(() => [...(data ?? [])].reverse(), [data]);
  const count = photos.length;
  const safeIndex = Math.min(index, Math.max(count - 1, 0));
  const photo = photos[safeIndex];

  useEffect(() => {
<<<<<<< Updated upstream
    if (data) {
      setDailyPhotoUrl(data.getDailyPhotos[0].photoUrl);
    }
  }, [data]);

  useEffect(() => {
    if (!data || !lineRef.current || circleRefs.current.length === 0) return;

    const index = data.getDailyPhotos.findIndex(
      (photo: DailyPhoto) => photo.photoUrl === dailyPhotoUrl,
=======
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
>>>>>>> Stashed changes
    );

<<<<<<< Updated upstream
    const targetEl = circleRefs.current[index];
    if (!targetEl) return;

    const containerRect = lineRef.current.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const distance =
      targetRect.left - containerRect.left + targetEl.offsetWidth / 2;
    const percent = (distance / lineRef.current.offsetWidth) * 100;

    setFillLine(percent);
  }, [dailyPhotoUrl, data]);

  useEffect(() => {
    if (isPlay && data) {
      intervalRef.current = setInterval(() => {
        setFadeIn(false);

        setTimeout(() => {
          setActiveIndex((prevIndex) => {
            const nextIndex = (prevIndex + 1) % data.getDailyPhotos.length;
            setDailyPhotoUrl(data.getDailyPhotos[nextIndex].photoUrl);
            return nextIndex;
          });
          setFadeIn(true);
        }, 500);
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlay, data]);

  if (loading && !dailyPhotoUrl) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
=======
  const progress = count > 1 ? safeIndex / (count - 1) : 1;
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
      <div
        className={`w-full ${fullScreen ? 'h-[7dvh]' : 'h-[10dvh]'} absolute bottom-0 flex justify-center items-center gap-5 px-3 duration-500 ${fullScreen ? 'opacity-0' : 'opacity-100'} hover:opacity-100`}
      >
        <div
          ref={lineRef}
          className="relative w-[90%] h-2 bg-white rounded-2xl flex justify-between items-center"
        >
          <div
            className="absolute bg-black h-2 rounded-2xl transition-all duration-500"
            style={{ width: `${fillLine}%` }}
          ></div>

          {data.getDailyPhotos.map((dailyPhoto: DailyPhoto, index: number) => {
            return (
              <div
                key={dailyPhoto.id}
                ref={(el) => {
                  circleRefs.current[index] = el;
                }}
                className="z-10 flex justify-center items-center"
              >
=======
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
>>>>>>> Stashed changes
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
