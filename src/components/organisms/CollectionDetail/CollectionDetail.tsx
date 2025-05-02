import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoCloudUpload } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { useParams } from '@tanstack/react-router';
import { useRouter } from '@tanstack/react-router';
import { Image, Modal, Typography } from 'antd';
import { motion } from 'framer-motion';

import defaultImage from '@/assets/default_img.svg';
import { Button } from '@/atoms/Button';
import { CollectionSkeleton } from '@/atoms/CollectionSkeleton';
import { CollectionForm } from '@/atoms/CreateCollection';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants/message';
import { useToast } from '@/contexts/ToastContext';
import { ActionButtons } from '@/molecules/ActionButtons';
import { FoodsSection } from '@/molecules/FoodsSection';
import { PopupUpload } from '@/molecules/PopupUpload';
import {
  useDeleteCollectionMutation,
  useGetCollectionDetailQuery,
  useUpdateCollectionMutation,
} from '@/redux/query/apis/collection/collectionApi';
import { userSelector } from '@/redux/slices/user';
import type { CreateCollectionFormValues } from '@/schemas/collectionSchema';
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
  const { data, isLoading, refetch } = useGetCollectionDetailQuery(id!);
  const [upload, setUpload] = useState(false);
  const [updateCollection] = useUpdateCollectionMutation();
  const user = useSelector(userSelector).user;
  const [deleteCollection] = useDeleteCollectionMutation();
  const { showToastError, showToastSuccess } = useToast();
  const [img, setImg] = useState<string | undefined>(undefined);
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    if (data?.data?.foods) {
      setFoods(data.data.foods);
    }
    if (data?.data?.img) {
      setImg(data.data.img);
    }
  }, [data]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSetAsRecurring = () => {
    console.log('Set as recurring clicked');
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteCollection(id).unwrap();
      showToastSuccess(SUCCESS_MESSAGES.COLLECTION_DELETE_SUCCESS);
      router.history.back();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      showToastError(ERROR_MESSAGES.DELETE_COLLECTION_FAILED);
    }
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

  const handleAddFood = async (foodId: string) => {
    if (!data?.data) return;
    if (!id) return;

    const isFoodAlreadyAdded = foods.some(
      (item) =>
        (typeof item.food === 'string' ? item.food : item.food._id) === foodId,
    );
    if (isFoodAlreadyAdded) {
      showToastError(ERROR_MESSAGES.FOOD_ALREADY_IN_COLLECTION);
      return;
    }

    const updatedFoods = [
      ...foods.map((item) => ({
        food: typeof item.food === 'string' ? item.food : item.food._id,
        date: item.date,
      })),
      { food: foodId, date: new Date().toISOString() },
    ];

    try {
      await updateCollection({
        id,
        data: {
          foods: updatedFoods,
        },
      }).unwrap();

      refetch();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      showToastError(ERROR_MESSAGES.ADD_FOOD_FAILED);
    }
  };

  const onSubmit = async (data: CreateCollectionFormValues) => {
    if (!id) return;
    try {
      await updateCollection({
        id: id,
        data,
      }).unwrap();
      setIsEditModalOpen(false);
      refetch();
      showToastSuccess('Update successful!');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToastError('Update failed!');
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
            <Image src={img || defaultImage} className='rounded-md' />
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
          onAddFood={handleAddFood}
        />
        <Modal
          title='Edit Collection'
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          footer={null}
          destroyOnClose
        >
          <CollectionForm
            isCreate={false}
            isLoading={false}
            defaultValues={{
              title: data?.data?.title || '',
              description: data?.data?.description || '',
            }}
            onSubmit={onSubmit}
          />
        </Modal>
      </div>
    </motion.div>
  );
};

export default CollectionDetail;
