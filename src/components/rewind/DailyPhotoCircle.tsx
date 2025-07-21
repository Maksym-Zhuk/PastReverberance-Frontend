'use state';
import { DailyPhoto } from '@/generated/graphql';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image';
import { useRef, useState } from 'react';

interface Props {
  data: DailyPhoto;
  dailyPhotoUrl: string;
  setDailyPhotoUrl: (dailyPhotoUrl: string) => void;
  index: number;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export default function DailyPhotoCircle({
  data,
  dailyPhotoUrl,
  setDailyPhotoUrl,
  index,
  activeIndex,
  setActiveIndex,
}: Props) {
  const [open, setOpen] = useState<boolean>(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 300);
  };

  return (
    <HoverCard key={data.id} open={open}>
      <HoverCardTrigger asChild>
        <button
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`w-5 h-5 ${dailyPhotoUrl == data.photoUrl ? 'bg-black' : (activeIndex as number) > index ? 'bg-black' : 'bg-white'} rounded-full cursor-pointer`}
          onClick={() => {
            setDailyPhotoUrl(data.photoUrl);
            setActiveIndex(index);
            setOpen(false);
          }}
        ></button>
      </HoverCardTrigger>
      <HoverCardContent>
        <AspectRatio
          ratio={16 / 9}
          className="w-full h-full bg-muted rounded-lg"
        >
          <Image
            src={data.photoUrl}
            alt="Photo by Drew Beamer"
            fill
            className="h-full w-full rounded-lg object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </AspectRatio>
      </HoverCardContent>
    </HoverCard>
  );
}
