'use client';
import DailyPhotoCircle from '@/components/rewind/DailyPhotoCircle';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { DailyPhoto } from '@/generated/graphql';
import { GETDAILYPHOTO } from '@/graphql/dailyPhoto';
import { useQuery } from '@apollo/client';
import { Expand, Maximize, Pause, Play, Settings } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function RewindPage() {
  const { data, loading, error } = useQuery(GETDAILYPHOTO);
  const [dailyPhotoUrl, setDailyPhotoUrl] = useState<string>('');
  const [fillLine, setFillLine] = useState<number>(0);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [fullScreen, setFullScreen] = useState<boolean>(false);
  const [isPlay, setIsPlay] = useState<boolean>(false);
  const [fadeIn, setFadeIn] = useState<boolean>(true);

  const lineRef = useRef<HTMLDivElement>(null);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (data) {
      setDailyPhotoUrl(data.getDailyPhotos[0].photoUrl);
    }
  }, [data]);

  useEffect(() => {
    if (!data || !lineRef.current || circleRefs.current.length === 0) return;

    const index = data.getDailyPhotos.findIndex(
      (photo: DailyPhoto) => photo.photoUrl === dailyPhotoUrl,
    );
    if (index === -1) return;

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

  return (
    <div
      className={`w-full h-[100dvh] flex flex-col justify-between items-center ${fullScreen ? 'absolute p-5' : 'relative pr-5'}`}
    >
      <div className={`w-full h-[100dvh] flex justify-center items-center`}>
        <AspectRatio
          ratio={16 / 9}
          className="w-full h-full flex justify-center items-center bg-muted rounded-lg"
          onClick={() => setIsPlay(!isPlay)}
        >
          <Image
            src={
              dailyPhotoUrl
                ? dailyPhotoUrl
                : 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80'
            }
            alt="Photo by Drew Beamer"
            fill
            className={`h-full w-full rounded-lg object-cover transition-opacity duration-300 ${
              fadeIn ? 'opacity-100' : 'opacity-0'
            } dark:brightness-[0.2] dark:grayscale`}
          />
          <Button
            className={`absolute w-20 h-20 duration-700 ${isPlay ? 'opacity-0' : 'opacity-100'}`}
          >
            {isPlay ? <Pause /> : <Play />}
          </Button>
        </AspectRatio>
      </div>

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
                <DailyPhotoCircle
                  index={index}
                  data={dailyPhoto}
                  dailyPhotoUrl={dailyPhotoUrl}
                  setDailyPhotoUrl={setDailyPhotoUrl}
                  activeIndex={activeIndex}
                  setActiveIndex={setActiveIndex}
                />
              </div>
            );
          })}
        </div>
        <Button className="w-10 h-9 cursor-pointer">
          <Link href={'/settings'}>
            <Settings />
          </Link>
        </Button>
        <Button
          className="w-10 h-9 cursor-pointer"
          onClick={() => setFullScreen(!fullScreen)}
        >
          {fullScreen ? <Expand /> : <Maximize />}
        </Button>
      </div>
    </div>
  );
}
