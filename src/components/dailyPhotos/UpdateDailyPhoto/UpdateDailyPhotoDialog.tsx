'use client';
import { DailyPhoto } from '@/generated/graphql';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GETDAILYPHOTO, UPDATEDAILYPHOTO } from '@/graphql/dailyPhoto';
import { useMutation } from '@apollo/client';

type FormValues = {
  id: number;
  note: string;
  date: string;
};

export default function UpdateDailyPhotoDialog({ data }: { data: DailyPhoto }) {
  const today = new Date();
  const todayISO = today.toISOString();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString();

  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
  const dayBeforeYesterdayISO = dayBeforeYesterday.toISOString();
  const [open, setOpen] = useState(false);

  const [updateDailyPhoto] = useMutation(UPDATEDAILYPHOTO, {
    refetchQueries: [{ query: GETDAILYPHOTO }],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    defaultValues: {
      note: data.note as string,
      date: data.createdAt as string,
    },
  });

  useEffect(() => {
    if (open && data) {
      reset({
        note: data.note ?? '',
        date: data.createdAt as string,
        id: data.id,
      });
    }
  }, [open, data, reset]);

  const onSubmit = async (dataForm: FormValues) => {
    updateDailyPhoto({
      variables: {
        input: {
          id: data.id,
          note: dataForm.note,
          date: dataForm.date,
        },
      },
    });
    closeDialog();
  };

  function openDialog() {
    setOpen(true);
  }

  function closeDialog() {
    setOpen(false);
  }

  return (
    <div className="lg:flex hidden">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="cursor-pointer" onClick={openDialog}>
            <Pencil />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="w-full flex flex-col justify-center items-center p-3 pb-0 gap-10"
          >
            <DialogHeader>
              <DialogTitle>Edit dailyPhoto</DialogTitle>
              <DialogDescription>
                Make changes to your dailyPhoto here. Click save when
                you&apos;re done.
              </DialogDescription>
            </DialogHeader>
            <div className="w-full flex flex-col gap-2">
              <Textarea
                placeholder="Type your note here."
                id="note"
                {...register('note', { required: 'Note is required' })}
                className="resize-none w-full h-50"
              />
              {errors.note && (
                <p className="text-red-500">{errors.note.message}</p>
              )}

              <Controller
                name="date"
                control={control}
                render={({ field }) => {
                  return (
                    <>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Date" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={todayISO}>Today</SelectItem>
                          <SelectItem value={yesterdayISO}>
                            Yesterday
                          </SelectItem>
                          <SelectItem value={dayBeforeYesterdayISO}>
                            Day before yesterday
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.date && (
                        <p className="text-red-500 mt-1">
                          {errors.date.message}
                        </p>
                      )}
                    </>
                  );
                }}
              />
            </div>
            <DialogFooter className="w-full flex justify-end">
              <DialogClose asChild>
                <Button variant="outline" onClick={closeDialog}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
