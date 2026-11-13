'use client';
import DailyPhotoCircle from '@/components/rewind/DailyPhotoCircle';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDailyPhotos } from '@/hooks/useDailyPhotos';
import { formatDate, formatDateTime } from '@/lib/date';
import { cn } from '@/lib/utils';
import {
  ImagePlus,
  Maximize,
  Minimize,
  Pause,
  Play,
  Settings2,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// seconds per photo
const SPEEDS = [1, 2, 3, 5] as const;
const HIDE_MS = 2500; // fullscreen: hide controls after this much inactivity
const DOT = 20; // px, keeps the progress bar aligned with the dot centers

// x position of dot i on the timeline, as a CSS length
const at = (i: number, count: number) =>
  `calc(${DOT / 2}px + (100% - ${DOT}px) * ${count > 1 ? i / (count - 1) : 1})`;

// typing in fields or using an open dialog/popover must not drive the player
const ignoreKey = (e: KeyboardEvent) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return true;
  const t = e.target as HTMLElement | null;
  if (!t?.closest) return false;
  if (t.closest('input, textarea, select, [contenteditable="true"]'))
    return true;
  if (t.closest('[role="dialog"], [data-slot="popover-content"]')) return true;
  // let the focused button handle its own Space/Enter click
  return (
    (e.key === ' ' || e.key === 'Enter') &&
    !!t.closest('button, a, [role="button"]')
  );
};

export default function RewindPage() {
  const { data, isLoading, error } = useDailyPhotos();
  const [index, setIndex] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [idle, setIdle] = useState(false);
  const [seconds, setSeconds] = useState<number>(3);
  const [showCaption, setShowCaption] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // API returns newest first; a rewind plays oldest -> newest
  const photos = useMemo(() => [...(data ?? [])].reverse(), [data]);
  const count = photos.length;
  const last = Math.max(count - 1, 0);
  const safeIndex = Math.min(index, last);
  const photo = photos[safeIndex];

  const go = (i: number) => setIndex(Math.max(0, Math.min(i, last)));
  const togglePlay = () => {
    if (isPlay) return setIsPlay(false);
    // like a finished video: play from the start again
    if (safeIndex >= last) setIndex(0);
    setIsPlay(count > 1);
  };
  const setFull = (v: boolean) => {
    setIdle(false);
    setFullScreen(v);
    // whole document, so Radix portals (settings, dot previews) stay visible
    if (v) document.documentElement.requestFullscreen?.().catch(() => {});
    else if (document.fullscreenElement) document.exitFullscreen?.();
  };
  const changeSpeed = (dir: 1 | -1) => {
    const i = SPEEDS.indexOf(seconds as (typeof SPEEDS)[number]);
    // ">" = faster = fewer seconds per photo
    setSeconds(SPEEDS[Math.max(0, Math.min(i - dir, SPEEDS.length - 1))]);
  };

  // the latest handlers, so the listener below never sees stale state
  const actions = useRef({ go, togglePlay, setFull, changeSpeed });
  actions.current = { go, togglePlay, setFull, changeSpeed };
  const state = useRef({ safeIndex, last, fullScreen });
  state.current = { safeIndex, last, fullScreen };
  // stable identity, so memoized timeline dots don't re-render on every slide
  // the slide we just left stays mounted so it can sit under the fade-in
  const prevIndex = useRef(safeIndex);
  useEffect(() => {
    prevIndex.current = safeIndex;
  }, [safeIndex]);
  const select = useCallback((i: number) => actions.current.go(i), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (ignoreKey(e)) return;
      const a = actions.current;
      const s = state.current;
      const k = e.key;
      if (k === ' ' || k === 'k' || k === 'K') a.togglePlay();
      else if (k === 'ArrowLeft' || k === 'j' || k === 'J')
        a.go(s.safeIndex - 1);
      else if (k === 'ArrowRight' || k === 'l' || k === 'L')
        a.go(s.safeIndex + 1);
      else if (k === 'Home') a.go(0);
      else if (k === 'End') a.go(s.last);
      else if (/^[0-9]$/.test(k)) a.go(Math.round((Number(k) / 10) * s.last));
      else if (k === 'f' || k === 'F') a.setFull(!s.fullScreen);
      else if (k === 'Escape' && s.fullScreen) a.setFull(false);
      else if (k === 'c' || k === 'C') setShowCaption((v) => !v);
      else if (k === '>') a.changeSpeed(1);
      else if (k === '<') a.changeSpeed(-1);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // leaving browser fullscreen via its own UI/Esc also leaves ours
  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) setFullScreen(false);
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  // YouTube-style: any activity shows the controls, inactivity hides them
  useEffect(() => {
    if (!fullScreen) return;
    let t: ReturnType<typeof setTimeout>;
    const arm = () => {
      clearTimeout(t);
      t = setTimeout(() => setIdle(true), HIDE_MS);
    };
    const wake = (e: Event) => {
      setIdle(false);
      clearTimeout(t);
      // keep the bar up while the pointer is on it
      if (!(e.target as Element).closest?.('[data-controls]')) arm();
    };
    const events = ['mousemove', 'touchstart', 'keydown'] as const;
    events.forEach((n) => window.addEventListener(n, wake));
    arm();
    return () => {
      clearTimeout(t);
      events.forEach((n) => window.removeEventListener(n, wake));
    };
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

  // stays visible while paused, like YouTube
  const hideUi = fullScreen && idle && isPlay && !settingsOpen;
  const ctrl = cn(
    fullScreen && 'text-white hover:bg-white/15 hover:text-white',
  );

  return (
    <div
      className={cn(
        'bg-background flex flex-col gap-3',
        fullScreen
          ? 'dark fixed inset-0 z-50 bg-black text-foreground'
          : 'min-h-[calc(100dvh-5rem)] p-4 lg:min-h-[100dvh] lg:p-6',
        hideUi && 'cursor-none',
      )}
    >
      <div
        className={cn(
          'relative flex-1 overflow-hidden bg-black',
          !fullScreen && 'min-h-[40dvh] rounded-xl',
        )}
      >
        {/* stacked slides: the new one fades in over the old one, which only hides afterwards (no dip to black); neighbours are preloaded */}
        {[
          ...new Set([
            prevIndex.current,
            safeIndex - 1,
            safeIndex,
            safeIndex + 1,
          ]),
        ]
          .filter((i) => photos[i])
          .map((i) => {
            const p = photos[i];
            const shown = i === safeIndex;
            return (
              <Image
                key={p.id}
                src={p.photoUrl}
                alt={shown ? p.note || `Photo from ${formatDate(p.date)}` : ''}
                aria-hidden={!shown}
                fill
                priority={shown}
                sizes="100vw"
                className={cn(
                  'object-contain transition-opacity',
                  shown
                    ? 'starting:opacity-0 z-10 opacity-100 duration-500'
                    : 'opacity-0 delay-500 duration-0',
                )}
              />
            );
          })}
        <button
          type="button"
          onClick={togglePlay}
          onDoubleClick={() => setFull(!fullScreen)}
          aria-label={isPlay ? 'Pause rewind' : 'Play rewind'}
          className="absolute inset-0 flex cursor-pointer items-center justify-center outline-none"
        >
          <span
            className={cn(
              'bg-primary text-primary-foreground flex size-16 items-center justify-center rounded-full shadow-lg transition-opacity duration-300',
              isPlay ? 'opacity-0' : 'opacity-100',
            )}
          >
            {isPlay ? <Pause /> : <Play />}
          </span>
        </button>
        {showCaption && (
          <div
            className={cn(
              'pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white transition-[padding] duration-300',
              fullScreen && !hideUi && 'pb-32',
            )}
          >
            <p className="text-sm font-medium">{formatDateTime(photo.date)}</p>
            {photo.note && <p className="line-clamp-2 text-sm">{photo.note}</p>}
          </div>
        )}
      </div>

      <div
        data-controls
        className={cn(
          'flex flex-col gap-1 transition-opacity duration-300',
          fullScreen &&
            'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pt-12 pb-3',
          hideUi ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
      >
        {/* scrubber */}
        <div className="overflow-x-auto px-1 py-2">
          <div className="relative flex w-max min-w-full items-center justify-between gap-3">
            <div className="bg-muted absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full" />
            <div
              className="bg-primary absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full transition-[width] duration-300"
              style={{ width: at(safeIndex, count) }}
            />
            {/* current slide's progress; finishing it advances, so bar and timer can't drift */}
            {safeIndex < last && (
              <div
                key={safeIndex}
                className="bg-primary absolute top-1/2 h-1.5 origin-left -translate-y-1/2"
                style={{
                  left: at(safeIndex, count),
                  width: `calc((100% - ${DOT}px) / ${count - 1})`,
                  animationName: 'grow-x',
                  animationDuration: `${seconds}s`,
                  animationTimingFunction: 'linear',
                  animationFillMode: 'forwards',
                  animationPlayState: isPlay ? 'running' : 'paused',
                }}
                onAnimationEnd={() => {
                  if (!isPlay) return;
                  go(safeIndex + 1);
                  // the end of the rewind stops playback, like a video
                  if (safeIndex + 1 >= last) setIsPlay(false);
                }}
              />
            )}
            {photos.map((p, i) => (
              <div key={p.id} className="relative z-10">
                <DailyPhotoCircle
                  data={p}
                  index={i}
                  reached={i <= safeIndex}
                  current={i === safeIndex}
                  onSelect={select}
                />
              </div>
            ))}
          </div>
        </div>

        {/* buttons row */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={ctrl}
            onClick={() => go(safeIndex - 1)}
            disabled={safeIndex === 0}
            aria-label="Previous photo"
            title="Previous (←)"
          >
            <SkipBack />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={ctrl}
            onClick={togglePlay}
            aria-label={isPlay ? 'Pause' : 'Play'}
            title={isPlay ? 'Pause (k)' : 'Play (k)'}
          >
            {isPlay ? <Pause /> : <Play />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={ctrl}
            onClick={() => go(safeIndex + 1)}
            disabled={safeIndex === last}
            aria-label="Next photo"
            title="Next (→)"
          >
            <SkipForward />
          </Button>
          <p
            className={cn(
              'ml-2 min-w-0 truncate text-sm tabular-nums',
              fullScreen ? 'text-white/80' : 'text-muted-foreground',
            )}
          >
            {safeIndex + 1} / {count}
            <span className="hidden sm:inline">
              {' '}
              · {formatDate(photo.date)}
            </span>
          </p>

          <div className="ml-auto flex items-center gap-1">
            <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={ctrl}
                  aria-label="Rewind settings"
                >
                  <Settings2 />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Speed per photo</p>
                  <div
                    role="radiogroup"
                    aria-label="Speed per photo"
                    className="bg-muted grid grid-cols-4 gap-1 rounded-lg p-1"
                  >
                    {SPEEDS.map((n) => (
                      <button
                        key={n}
                        type="button"
                        role="radio"
                        aria-checked={seconds === n}
                        onClick={() => setSeconds(n)}
                        className={cn(
                          'rounded-md py-1 text-sm transition-colors',
                          seconds === n
                            ? 'bg-background font-medium shadow-sm'
                            : 'text-muted-foreground hover:text-foreground',
                        )}
                      >
                        {n}s
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span id="caption-label" className="text-sm font-medium">
                    Show caption
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={showCaption}
                    aria-labelledby="caption-label"
                    onClick={() => setShowCaption((v) => !v)}
                    className={cn(
                      'focus-visible:ring-ring/50 relative h-5 w-9 shrink-0 rounded-full outline-none transition-colors focus-visible:ring-[3px]',
                      showCaption ? 'bg-primary' : 'bg-muted-foreground/40',
                    )}
                  >
                    <span
                      className={cn(
                        'bg-background absolute top-0.5 left-0.5 size-4 rounded-full shadow transition-transform',
                        showCaption && 'translate-x-4',
                      )}
                    />
                  </button>
                </div>
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              className={ctrl}
              onClick={() => setFull(!fullScreen)}
              aria-label={fullScreen ? 'Exit full screen' : 'Full screen'}
              title={fullScreen ? 'Exit full screen (f)' : 'Full screen (f)'}
            >
              {fullScreen ? <Minimize /> : <Maximize />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
