'use client';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { formatDateTime } from '@/lib/date';
import type { DailyPhoto } from '@/types/api';

// card thumbnail that opens the photo full screen
export default function PhotoPreview({
  data,
  priority,
}: {
  data: DailyPhoto;
  priority?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="View photo full screen"
          className="bg-muted focus-visible:ring-ring/50 relative aspect-video w-full cursor-zoom-in overflow-hidden rounded-lg outline-none focus-visible:ring-[3px]"
        >
          <Image
            src={data.photoUrl}
            alt="Daily photo"
            fill
            priority={priority}
            sizes="(min-width: 1536px) 25vw, (min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="top-0 left-0 h-dvh max-w-none translate-x-0 translate-y-0 gap-0 rounded-none border-0 bg-black/95 p-0 sm:max-w-none"
      >
        <DialogTitle className="sr-only">
          Photo from {formatDateTime(data.date)}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {data.note || 'Full screen photo preview'}
        </DialogDescription>
        {/* click on the empty area closes, like most lightboxes */}
        <div
          className="relative size-full cursor-zoom-out"
          onClick={() => setOpen(false)}
        >
          <Image
            src={data.photoUrl}
            alt={data.note || `Photo from ${formatDateTime(data.date)}`}
            fill
            priority
            sizes="100vw"
            className="object-contain"
          />
        </div>
        <DialogClose
          aria-label="Close"
          className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full bg-black/60 text-white outline-none hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="size-5" />
        </DialogClose>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
          <p className="text-sm font-medium">{formatDateTime(data.date)}</p>
          {data.note && (
            <p className="mt-1 line-clamp-3 text-sm">{data.note}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
