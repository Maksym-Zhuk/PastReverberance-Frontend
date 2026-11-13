'use client';
import type { DailyPhoto } from '@/types/api';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { formatDate } from '@/lib/date';
import Image from 'next/image';

interface Props {
  data: DailyPhoto;
  // already passed (filled) vs. the one currently shown
  reached: boolean;
  current: boolean;
  onSelect: () => void;
}

export default function DailyPhotoCircle({
  data,
  reached,
  current,
  onSelect,
}: Props) {
  return (
    <HoverCard openDelay={100} closeDelay={200}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          onClick={onSelect}
          aria-label={`Show photo from ${formatDate(data.date)}`}
          aria-current={current ? 'true' : undefined}
          className={`size-5 shrink-0 cursor-pointer rounded-full border-2 transition-transform focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none ${
            reached
              ? 'bg-primary border-primary'
              : 'bg-background border-muted-foreground/50'
          } ${current ? 'scale-125' : ''}`}
        />
      </HoverCardTrigger>
      <HoverCardContent className="w-60">
        <AspectRatio ratio={16 / 9} className="bg-muted rounded-lg">
          <Image
            src={data.photoUrl}
            alt={`Photo from ${formatDate(data.date)}`}
            fill
            sizes="240px"
            className="rounded-lg object-cover"
          />
        </AspectRatio>
        <p className="text-muted-foreground mt-2 text-xs">
          {formatDate(data.date)}
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}
