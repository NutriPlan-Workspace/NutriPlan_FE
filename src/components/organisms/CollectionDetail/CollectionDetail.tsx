import React, { useEffect, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { IoCloudUpload } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { useParams, useRouter } from '@tanstack/react-router';
import { Image, Modal, Select, Typography } from 'antd';
import { motion } from 'framer-motion';

import { Button } from '@/atoms/Button';
import { CollectionSkeleton } from '@/atoms/CollectionSkeleton';
import { CollectionForm } from '@/atoms/CreateCollection';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants/message';
import { useToast } from '@/contexts/ToastContext';
import { ActionButtons } from '@/molecules/ActionButtons';
import { FoodsSection } from '@/molecules/FoodsSection';
import { PopupUpload } from '@/molecules/PopupUpload';
import {
  useCreateCollectionMutation,
  useDeleteCollectionMutation,
  useGetCollectionDetailQuery,
  useTrackCuratedCollectionCopyMutation,
  useTrackCuratedCollectionViewMutation,
  useUpdateCollectionMutation,
} from '@/redux/query/apis/collection/collectionApi';
import { userSelector } from '@/redux/slices/user';
import type { CreateCollectionFormValues } from '@/schemas/collectionSchema';
import HubPageShell from '@/templates/HubPageShell';
import type { CollectionFood } from '@/types/collection';
import type { MenuItemDropdown } from '@/types/menuItem';

const dropdownItems: MenuItemDropdown[] = [
  { key: '1', label: 'Date Added' },
  { key: '2', label: 'Name' },
];

const { Title, Paragraph } = Typography;

const DEFAULT_FAVORITE_IMAGE =
  'https://img.freepik.com/free-photo/chicken-fajita-chicken-fillet-fried-with-bell-pepper-lavash-with-bread-slices-white-plate_114579-174.jpg?t=st=1746506112~exp=1746509712~hmac=8bddd99a63709df09e8e40e0d7855c1584bcc4c86310d2e1b79ec6e9ae1f4f82&w=740';
const DEFAULT_EXCLUSION_IMAGE =
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop';
const DEFAULT_COLLECTION_IMAGE =
  'https://st.depositphotos.com/1809906/1375/v/950/depositphotos_13755635-stock-illustration-food-collection.jpg';

const CollectionDetail: React.FC = () => {
  const { id } = useParams({ strict: false }) as { id?: string };
  const router = useRouter();

  const [foods, setFoods] = useState<CollectionFood[]>([]);
  const [upload, setUpload] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [img, setImg] = useState<string | undefined>(undefined);
  const [recurringModalOpen, setRecurringModalOpen] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<
    'daily' | 'weekly' | 'monthly'
  >('weekly');

  const user = useSelector(userSelector).user;
  const { showToastError, showToastSuccess } = useToast();

  const { data, isLoading, refetch } = useGetCollectionDetailQuery(id!, {
    skip: !id,
  });
  const [createCollection] = useCreateCollectionMutation();
  const [updateCollection] = useUpdateCollectionMutation();
  const [deleteCollection] = useDeleteCollectionMutation();
  const [trackCuratedCollectionView] = useTrackCuratedCollectionViewMutation();
  const [trackCuratedCollectionCopy] = useTrackCuratedCollectionCopyMutation();

  useEffect(() => {
    const collection = data?.data;
    if (!id || !collection?.isCurated) return;
    trackCuratedCollectionView({ collectionId: id, source: 'detail' });
  }, [data?.data, data?.data?.isCurated, id, trackCuratedCollectionView]);

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
    const existingFrequency = data?.data?.recurringFrequency;
    if (existingFrequency) {
      setRecurringFrequency(existingFrequency);
    }
    setRecurringModalOpen(true);
  };

  const handleConfirmRecurring = async () => {
    if (!id) return;
    try {
      await updateCollection({
        id,
        data: {
          isRecurring: true,
          recurringFrequency,
          recurringStartDate: new Date().toISOString(),
        },
      }).unwrap();
      setRecurringModalOpen(false);
      refetch();
    } catch {
      showToastError('Failed to set recurring.');
    }
  };

  const handleDisableRecurring = async () => {
    if (!id) return;
    try {
      await updateCollection({
        id,
        data: {
          isRecurring: false,
        },
      }).unwrap();
      setRecurringModalOpen(false);
      refetch();
      showToastSuccess('Recurring disabled.');
    } catch {
      showToastError('Failed to update recurring.');
    }
  };

  const handleMakeCopy = async () => {
    if (!data?.data) return;
    try {
      const payload = {
        title: `${data.data.title} (Copy)`,
        description: data.data.description,
        img: data.data.img,
        foods: data.data.foods?.map((item) => ({
          food: item.food._id,
          date: item.date,
        })),
      };
      const response = await createCollection(payload).unwrap();
      if (response.data?._id) {
        if (data.data.isCurated && id) {
          trackCuratedCollectionCopy({
            collectionId: id,
            destinationCollectionId: response.data._id,
            source: 'detail',
          });
        }
        router.navigate({
          to: '/collections/$id',
          params: { id: response.data._id },
        });
      }
    } catch {
      showToastError('Failed to copy collection.');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteCollection(id).unwrap();
      showToastSuccess(SUCCESS_MESSAGES.COLLECTION_DELETE_SUCCESS);
      router.navigate({ to: '/collections' });
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
      setUpload(false);
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      showToastError(ERROR_MESSAGES.IMAGE_UPLOAD_FAILED);
    }
  };

  const handleRemoveFood = async (foodId: string) => {
    if (!id) return;

    const updatedFoods = foods
      .filter((item) => item.food._id !== foodId)
      .map((item) => ({
        food: item.food._id,
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

  const handleAddFood = async (foodId: string) => {
    if (!id) return;
    if (foods.some((item) => item.food._id === foodId)) {
      showToastError(ERROR_MESSAGES.FOOD_ALREADY_IN_COLLECTION);
      return;
    }

    const updatedFoods = [
      ...foods.map((item) => ({
        food: item.food._id,
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

  const onSubmit = async (formData: CreateCollectionFormValues) => {
    if (!id) return;
    try {
      await updateCollection({
        id,
        data: {
          title: formData.title,
          description: formData.description,
        },
      }).unwrap();
      setIsEditModalOpen(false);
      refetch();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      showToastError(ERROR_MESSAGES.CREATE_COLLECTION_FAILED);
    }
  };

  if (!id) return null;

  if (isLoading) {
    return <CollectionSkeleton />;
  }

  const titleText = data?.data?.title || 'Collection';
  const count = data?.data?.foods?.length ?? foods.length;
  const heroImage =
    img ||
    (data?.data?.isFavorites
      ? DEFAULT_FAVORITE_IMAGE
      : data?.data?.isExclusions
        ? DEFAULT_EXCLUSION_IMAGE
        : DEFAULT_COLLECTION_IMAGE);

  return (
    <motion.div
      className='w-full'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <HubPageShell
        maxWidthClassName='max-w-7xl'
        title={
          <span className='flex items-center gap-3'>
            <button
              type='button'
              onClick={() => router.history.back()}
              className='flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 bg-white/70 text-gray-700 transition hover:bg-white'
              aria-label='Back'
            >
              <FaArrowLeft className='h-4 w-4' />
            </button>
            <span className='min-w-0 truncate'>{titleText}</span>
          </span>
        }
        description='Manage items in this collection and reuse it anywhere.'
      >
        <div className='flex flex-col gap-6'>
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
            <div className='lg:col-span-4'>
              <div className='rounded-3xl border border-gray-200/70 bg-white/70 p-4 shadow-[0_14px_36px_-32px_rgba(16,24,40,0.22)]'>
                <Image
                  src={heroImage}
                  className='aspect-square w-full rounded-2xl object-cover'
                  preview={false}
                />
                <div className='mt-4 flex flex-col gap-2'>
                  <Button
                    className='flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white/70 font-semibold text-gray-800 hover:!bg-white'
                    onClick={() => setUpload(!upload)}
                  >
                    <IoCloudUpload />
                    Upload image
                  </Button>
                  <PopupUpload
                    isModalOpen={upload}
                    setModalOpen={setUpload}
                    onUploaded={handleUploaded}
                  />
                </div>
              </div>
            </div>

            <div className='lg:col-span-8'>
              <div className='rounded-3xl border border-gray-200/70 bg-white/70 p-5 shadow-[0_14px_36px_-32px_rgba(16,24,40,0.22)] sm:p-6'>
                <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                  <div className='min-w-0'>
                    <Title level={3} className='m-0 font-light'>
                      {titleText}
                    </Title>
                    <Paragraph className='m-0 mt-1 text-sm text-gray-500'>
                      {user?.fullName}
                      <span className='mx-2 text-gray-300'>•</span>
                      {count} item{count === 1 ? '' : 's'}
                    </Paragraph>
                  </div>
                  <div className='shrink-0'>
                    <ActionButtons
                      isFavorite={data?.data?.isFavorites || false}
                      isExclusion={data?.data?.isExclusions || false}
                      isCurated={data?.data?.isCurated || false}
                      isRecurring={data?.data?.isRecurring}
                      recurringFrequency={data?.data?.recurringFrequency}
                      onEdit={handleEdit}
                      onSetAsRecurring={handleSetAsRecurring}
                      onMakeCopy={handleMakeCopy}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>
              </div>
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

          <Modal
            title='Set recurring'
            open={recurringModalOpen}
            onCancel={() => setRecurringModalOpen(false)}
            footer={
              <div className='flex justify-end gap-2 pt-4'>
                <Button
                  className='rounded-xl border border-gray-200 bg-white px-4 py-2 font-medium text-gray-600 hover:bg-gray-50'
                  onClick={() => setRecurringModalOpen(false)}
                >
                  Cancel
                </Button>
                {data?.data?.isRecurring && (
                  <Button
                    className='rounded-xl border border-red-200 bg-red-50 px-4 py-2 font-medium text-red-600 hover:bg-red-100'
                    onClick={handleDisableRecurring}
                  >
                    Turn Off
                  </Button>
                )}
                <Button
                  className='bg-secondary-600 hover:bg-secondary-700 rounded-xl px-4 py-2 font-medium text-white'
                  onClick={handleConfirmRecurring}
                >
                  Save
                </Button>
              </div>
            }
          >
            <div className='space-y-3'>
              <p className='text-sm text-gray-600'>
                Choose how often to reuse this collection when generating meals.
              </p>
              <Select
                value={recurringFrequency}
                onChange={(value) => setRecurringFrequency(value)}
                className='w-full'
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                ]}
              />
            </div>
          </Modal>
        </div>
      </HubPageShell>
    </motion.div>
  );
};

export default CollectionDetail;
