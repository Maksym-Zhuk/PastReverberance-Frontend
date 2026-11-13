'use client';

import { format, setHours, setMinutes } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DATE_TIME_FORMAT } from '@/lib/date';
import { cn } from '@/lib/utils';

const pad = (n: number) => String(n).padStart(2, '0');
const range = (n: number) => Array.from({ length: n }, (_, i) => pad(i));
const HOURS = range(24);
const MINUTES = range(60);

type Props = {
  id?: string;
  value: Date;
  onChange: (value: Date) => void;
  max?: Date;
};

// no typing: the trigger only opens a popup with a calendar and time selects
export function DateTimePicker({ id, value, onChange, max }: Props) {
  const clamp = (d: Date) => (max && d > max ? max : d);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          className={cn(
            'dark:bg-input/30 border-input focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full items-center justify-between rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px]',
          )}
        >
          {format(value, DATE_TIME_FORMAT)}
          <CalendarDays className="text-muted-foreground size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-3">
        <DayPicker
          mode="single"
          required
          selected={value}
          defaultMonth={value}
          weekStartsOn={1}
          captionLayout="dropdown"
          startMonth={new Date(2000, 0)}
          endMonth={max ?? new Date(new Date().getFullYear() + 1, 11)}
          disabled={max ? { after: max } : undefined}
          onSelect={(day) =>
            onChange(
              clamp(
                setMinutes(setHours(day, value.getHours()), value.getMinutes()),
              ),
            )
          }
          classNames={{
            root: 'text-sm',
            months: 'relative flex flex-col gap-3',
            month_caption: 'flex h-8 items-center justify-center',
            dropdowns: 'flex items-center gap-1 font-medium',
            dropdown_root: 'relative',
            dropdown: 'absolute inset-0 cursor-pointer opacity-0',
            caption_label:
              'hover:bg-accent flex items-center gap-1 rounded-md px-2 py-1',
            nav: 'absolute inset-x-0 top-0 flex items-center justify-between',
            button_previous:
              'hover:bg-accent inline-flex size-8 items-center justify-center rounded-md',
            button_next:
              'hover:bg-accent inline-flex size-8 items-center justify-center rounded-md',
            chevron: 'size-4 fill-current',
            month_grid: 'w-full border-collapse',
            weekday: 'text-muted-foreground size-9 text-xs font-normal',
            day: 'p-0 text-center',
            day_button:
              'hover:bg-accent inline-flex size-9 items-center justify-center rounded-md',
            selected:
              '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button:hover]:bg-primary',
            today: '[&>button]:border [&>button]:border-ring',
            outside: 'text-muted-foreground opacity-50',
            disabled: 'pointer-events-none opacity-30',
          }}
        />
        <div className="mt-3 flex items-center gap-2 border-t pt-3">
          <span className="text-muted-foreground mr-auto text-sm">Time</span>
          <Select
            value={pad(value.getHours())}
            onValueChange={(h) => onChange(clamp(setHours(value, Number(h))))}
          >
            <SelectTrigger size="sm" aria-label="Hours" className="w-[4.5rem]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[80] max-h-60">
              {HOURS.map((h) => (
                <SelectItem key={h} value={h}>
                  {h}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>:</span>
          <Select
            value={pad(value.getMinutes())}
            onValueChange={(m) => onChange(clamp(setMinutes(value, Number(m))))}
          >
            <SelectTrigger
              size="sm"
              aria-label="Minutes"
              className="w-[4.5rem]"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[80] max-h-60">
              {MINUTES.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
