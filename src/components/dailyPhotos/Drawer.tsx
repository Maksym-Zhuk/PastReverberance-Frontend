'use client';
import {
  Drawer as UIDrawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { useState } from 'react';

type FormValues = {
  file: FileList;
};

export default function Drawer() {
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
    <UIDrawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        className={`flex duration-300 w-15.5 h-15 justify-center items-center rounded-full bg-black cursor-pointer`}
        onClick={openDrawer}
      >
        <Plus size={28} className="text-white" />
      </DrawerTrigger>
      <Toaster className="z-100" />
      <DrawerContent className="h-[35dvh]">
        <DrawerHeader>
          <DrawerTitle>Select the desired file!</DrawerTitle>
        </DrawerHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="w-full flex flex-col justify-center items-center p-5 gap-5"
        >
          <input
            type="file"
            {...register('file', { required: 'File required!' })}
            name="file"
            className="w-3/4 text-lg"
          />
          {errors.file && <p className="text-red-500">{errors.file.message}</p>}

          <Button type="submit">Надіслати</Button>
        </form>
      </DrawerContent>
    </UIDrawer>
  );
}
