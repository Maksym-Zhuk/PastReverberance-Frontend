'use client';
import { DailyPhoto } from '@/generated/graphql';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { DELETEDAILYPHOTO, GETDAILYPHOTO } from '@/graphql/dailyPhoto';
import UpdateDailyPhotoDialog from './UpdateDailyPhoto/UpdateDailyPhotoDialog';
import UpdateDailyPhotoDrawer from './UpdateDailyPhoto/UpdateDailyPhotoDrawer';

export default function DailyPhotoCard({ data }: { data: DailyPhoto }) {
  const [deleteDailyPhoto] = useMutation(DELETEDAILYPHOTO, {
    refetchQueries: [{ query: GETDAILYPHOTO }],
  });

  const handleDelete = () => {
    deleteDailyPhoto({
      variables: {
        input: {
          id: data.id,
        },
      },
    });
  };

  return (
    <div className="w-[320px] p-3 bg-white flex flex-col justify-between rounded-xl">
      <div className="relative w-full flex justify-center aspect-video">
        <Image
          src={data.photoUrl}
          alt="Daily photo"
          fill
          className="object-cover rounded-lg"
        />
      </div>
      <div className="flex w-full h-full pt-4 gap-1">
        <div className="flex flex-col w-4/5 h-full justify-between">
          <p className="w-full pb-3 pl-1">{data.note}</p>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {data.date
              ? new Date(data.date as string).toLocaleDateString()
              : 'Select date'}
          </Button>
        </div>
        <div className="w-2/10 flex flex-col justify-end items-end gap-3">
          <UpdateDailyPhotoDialog data={data} />
          <UpdateDailyPhotoDrawer data={data} />
          <Button
            variant={'destructive'}
            className="cursor-pointer"
            onClick={handleDelete}
          >
            <Trash2 />
          </Button>
        </div>
      </div>
    </div>
  );
}
