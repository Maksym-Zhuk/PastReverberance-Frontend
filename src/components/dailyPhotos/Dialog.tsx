'use client';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { toast, Toaster } from 'sonner';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMutation } from '@apollo/client';
import { GETDAILYPHOTO, UPDATEDAILYPHOTO } from '@/graphql/dailyPhoto';

type FormValues = {
  file: FileList;
  note: string;
  date: string;
};

export default function Dialog() {
  const today = new Date();
  const todayISO = today.toISOString();

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString();

  const dayBeforeYesterday = new Date(today);
  dayBeforeYesterday.setDate(dayBeforeYesterday.getDate() - 2);
  const dayBeforeYesterdayISO = dayBeforeYesterday.toISOString();

  const [open, setOpen] = useState(false);
  const [toastId, setToastId] = useState<string | number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    control,
  } = useForm<FormValues>();
  const [updateDailyPhoto] = useMutation(UPDATEDAILYPHOTO, {
    refetchQueries: [{ query: GETDAILYPHOTO }],
  });

  const onSubmit = async (dataForm: FormValues) => {
    const file = dataForm.file?.[0];
    if (!file) {
      alert('File required!');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    closeDrawer();
    const id = toast.loading('Loading…');
    setToastId(id);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_REST_API_URL}/upload/daily-photo`,
        {
          method: 'POST',
          body: formData,
          credentials: 'include',
        },
      );

      if (!response.ok) {
        const text = await response.text();
        toast.dismiss(toastId!);
        setToastId(null);
        toast.error('Error from server:' + response.status + text);
        throw new Error('Error from server:' + response.status + text);
      }

      const json = await response.json();

      try {
        const { data } = await updateDailyPhoto({
          variables: {
            input: {
              id: json.id,
              note: dataForm.note,
              date: dataForm.date,
            },
          },
        });

        if (!data.updateDailyPhoto) {
          console.error('Error:' + data.errors[0].message);
          toast.dismiss(toastId!);
          setToastId(null);
          toast.error('Error: ' + data.errors[0].message);
        }

        console.log(data.updateDailyPhoto);
        toast.dismiss(toastId!);
        setToastId(null);
        toast.success('Image successfully saved!');
        reset();
      } catch (err) {
        console.error('Error:', err);
        toast.dismiss(toastId!);
        setToastId(null);
        toast.error('Error: ' + err);
      }
    } catch (err) {
      console.error('Error:', err);
      toast.dismiss(toastId!);
      setToastId(null);
      toast.error('Error: ' + err);
    }
  };

  function openDrawer() {
    setOpen(true);
  }

  function closeDrawer() {
    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger
        className={`flex duration-300 w-15.5 h-15 justify-center items-center rounded-full bg-black cursor-pointer ring-2 ring-white`}
        onClick={openDrawer}
      >
        <Plus size={28} className="text-white" />
      </AlertDialogTrigger>
      <Toaster />
      <AlertDialogContent>
        <AlertDialogHeader className="w-full flex justify-center items-center">
          <AlertDialogTitle>Select the desired file!</AlertDialogTitle>
        </AlertDialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="w-full flex flex-col justify-center items-center p-3 pb-0 gap-10"
        >
          <input
            type="file"
            {...register('file', { required: 'File required!' })}
            name="file"
            className="w-1/2 text-lg flex justify-center items-center"
          />
          {errors.file && <p className="text-red-500">{errors.file.message}</p>}

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
              rules={{ required: 'Date required!' }}
              render={({ field }) => {
                console.log('field.value', field.value);
                return (
                  <>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={todayISO}>Today</SelectItem>
                        <SelectItem value={yesterdayISO}>Yesterday</SelectItem>
                        <SelectItem value={dayBeforeYesterdayISO}>
                          Day before yesterday
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.date && (
                      <p className="text-red-500 mt-1">{errors.date.message}</p>
                    )}
                  </>
                );
              }}
            />
          </div>
          <div className="flex gap-5">
            <AlertDialogCancel asChild>
              <Button variant={'destructive'}>Cancel</Button>
            </AlertDialogCancel>
            <Button type="submit">Send</Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
