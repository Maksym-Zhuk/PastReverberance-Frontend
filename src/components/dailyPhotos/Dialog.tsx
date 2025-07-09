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
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { toast, Toaster } from 'sonner';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';

type FormValues = {
  file: FileList;
};

export default function Dialog() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();
  const [open, setOpen] = useState(false);
  const [toastId, setToastId] = useState<string | number | null>(null);

  const onSubmit = async (data: FormValues) => {
    const file = data.file?.[0];
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
        'https://c6j1w7gd-8080.euw.devtunnels.ms/upload/daily-photo',
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
        className={`flex duration-300 w-15.5 h-15 justify-center items-center rounded-full bg-black cursor-pointer`}
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
          className="w-full flex flex-col justify-center items-center p-5 pb-0 gap-10"
        >
          <input
            type="file"
            {...register('file', { required: 'File required!' })}
            name="file"
            className="w-1/2 text-lg flex justify-center items-center"
          />
          {errors.file && <p className="text-red-500">{errors.file.message}</p>}

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
