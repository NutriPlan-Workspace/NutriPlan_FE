import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoCloudUpload } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { useParams } from '@tanstack/react-router';
import { useRouter } from '@tanstack/react-router';
import { Image, Typography } from 'antd';
import { motion } from 'framer-motion';

import { Button } from '@/atoms/Button';
import { CollectionSkeleton } from '@/atoms/CollectionSkeleton';
import { ERROR_MESSAGES } from '@/constants/message';
import { useToast } from '@/contexts/ToastContext';
import { ActionButtons } from '@/molecules/ActionButtons';
import { FoodsSection } from '@/molecules/FoodsSection';
import { PopupUpload } from '@/molecules/PopupUpload';
import {
  useGetCollectionDetailQuery,
  useUpdateCollectionMutation,
} from '@/redux/query/apis/collection/collectionApi';
import { userSelector } from '@/redux/slices/user';
import type { CollectionFood } from '@/types/collection';
import type { MenuItemDropdown } from '@/types/menuItem';

const dropdownItems: MenuItemDropdown[] = [
  { key: '1', label: 'Date Added' },
  { key: '2', label: 'Name' },
];

const { Title, Paragraph } = Typography;

const CollectionDetail: React.FC = () => {
  const { id } = useParams({ strict: false });
  const [foods, setFoods] = useState<CollectionFood[]>([]);
  const { data, isLoading } = useGetCollectionDetailQuery(id!);
  const [upload, setUpload] = useState(false);
  const [updateCollection] = useUpdateCollectionMutation();
  const user = useSelector(userSelector).user;
  const { showToastError } = useToast();
  const [img, setImg] = useState<string | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (data?.data?.foods) {
      setFoods(data.data.foods);
    }
    if (data?.data?.img) {
      setImg(data.data.img);
    }
  }, [data]);

  const handleEdit = () => {
    console.log('Edit clicked');
  };

  const handleSetAsRecurring = () => {
    console.log('Set as recurring clicked');
  };

  const handleDelete = () => {
    console.log('Delete clicked');
  };

  const handleUploaded = async (url: string) => {
    if (!id) return;
    try {
      await updateCollection({
        id,
        data: {
          img: url,
        },
      }).unwrap();
      setImg(url);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToastError(ERROR_MESSAGES.IMAGE_UPLOAD_FAILED);
    }
  };

  const handleRemoveFood = async (foodId: string) => {
    if (!data?.data) return;
    if (!id) return;

    const updatedFoods = foods
      .filter((item) => item.food._id !== foodId)
      .map((item) => ({
        food: typeof item.food === 'string' ? item.food : item.food._id,
        date: item.date,
      }));

    try {
      await updateCollection({
        id,
        data: {
          foods: updatedFoods,
        },
      }).unwrap();

      setFoods((prevFoods) =>
        prevFoods.filter((item) => item.food._id !== foodId),
      );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      showToastError(ERROR_MESSAGES.REMOVE_FOOD_FAILED);
    }
  };

  if (isLoading) {
    return <CollectionSkeleton />;
  }

  return (
    <motion.div
      className='m-5 flex flex-col gap-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
          <FaArrowLeft
            onClick={() => router.history.back()}
            className='hover:text-primary cursor-pointer transition'
          />
          <Title level={3} className='m-0 font-thin'>
            {data?.data?.title}
          </Title>
        </div>
        <div className='flex items-start gap-6'>
          <div className='flex w-[200px] flex-col gap-2'>
            <Image
              src={
                img ||
                'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
              }
              className='rounded-md'
            />
            <Button
              className='my-2 flex items-center gap-2'
              onClick={() => setUpload(!upload)}
            >
              <IoCloudUpload />
              <Paragraph className='m-0'>Upload</Paragraph>
            </Button>
            <PopupUpload
            isModalOpen={upload}
            setModalOpen={setUpload}
            onUploaded={handleUploaded}
          />
          </div>
          <div className='mt-4 flex flex-col justify-between gap-14'>
            <div>
              <Paragraph className='m-0 text-sm font-thin text-gray-400'>
                {user?.fullName}
              </Paragraph>
              <Paragraph className='m-0 text-sm font-thin text-gray-400'>
                {data?.data?.foods?.length} item
              </Paragraph>
            </div>
            <ActionButtons
              isFavorite={data?.data?.isFavorites || false}
              onEdit={handleEdit}
              onSetAsRecurring={handleSetAsRecurring}
              onDelete={handleDelete}
            />
          </div>
        </div>
        <FoodsSection
          dropdownItems={dropdownItems}
          foods={foods}
          onRemoveFood={handleRemoveFood}
        />
      </div>
    </motion.div>
  );
};

export default CollectionDetail;
