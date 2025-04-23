import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaRegPlusSquare } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa6';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import { Input, Typography } from 'antd';
import { motion } from 'framer-motion';

import { Button } from '@/atoms/Button';
import { InputField } from '@/atoms/Input';
import { HTTP_STATUS } from '@/constants/httpStatus';
import { ERROR_MESSAGES } from '@/constants/message';
import { useToast } from '@/contexts/ToastContext';
import { cn } from '@/helpers/helpers';
import { useCreateCollectionMutation } from '@/redux/query/apis/collection/collectionApi';
import type { CreateCollectionFormValues } from '@/schemas/collectionSchema';
import { createCollectionSchema } from '@/schemas/collectionSchema';

const { TextArea } = Input;

const { Title, Paragraph } = Typography;

const CreateCollection: React.FC = () => {
  const router = useRouter();
  const [createCollection, { isLoading }] = useCreateCollectionMutation();
  const { showToastError } = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCollectionFormValues>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const onSubmit = async (data: CreateCollectionFormValues) => {
    try {
      const response = await createCollection(data).unwrap();
      if (response.code === HTTP_STATUS.OK) {
        router.history.back();
        return;
      }
      showToastError(ERROR_MESSAGES.CREATE_COLLECTION_FAILED);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToastError(ERROR_MESSAGES.CREATE_COLLECTION_FAILED);
    }
  };

  return (
    <motion.div
      className='m-4 flex flex-col gap-4'
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
    >
      <div className='flex flex-col gap-4 p-5'>
        <div className='flex items-center gap-4'>
          <FaArrowLeft
            onClick={() => router.history.back()}
            className='hover:text-primary cursor-pointer transition'
          />
          <Title level={3} className='m-0 font-thin'>
            Create Collection
          </Title>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='flex max-w-[700px] flex-col gap-4'
        >
          <div className='flex items-center justify-between border-b border-b-black/10 py-2'>
            <Paragraph className='m-0'>Create collection</Paragraph>
            <Controller
              name='title'
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  className={cn(
                    'min-w-[100px] rounded-sm',
                    errors.title && 'border border-red-500',
                  )}
                  error={errors.title?.message}
                />
              )}
            />
          </div>

          <div className='flex items-center justify-between gap-4'>
            <Paragraph className='m-0'>Description</Paragraph>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <TextArea {...field} rows={4} className='max-w-[400px]' />
              )}
            />
          </div>
          <div className='flex items-center justify-end gap-4'>
            <Button
              onClick={() => router.history.back()}
              className='border-red-300 hover:border-red-300 hover:text-red-300'
            >
              Cancel
            </Button>
            <Button
              htmlType='submit'
              disabled={isLoading}
              className='hover:border-primary border-primary flex max-w-[200px] items-center justify-center gap-4 py-4 hover:text-black'
            >
              <FaRegPlusSquare />
              <Paragraph className='m-0'>
                {isLoading ? 'Creating...' : 'Create'}
              </Paragraph>
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateCollection;
