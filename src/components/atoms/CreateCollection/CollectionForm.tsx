import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FaRegPlusSquare } from 'react-icons/fa';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@tanstack/react-router';
import { Input, Typography } from 'antd';

import { Button } from '@/atoms/Button';
import { InputField } from '@/atoms/Input';
import { cn } from '@/helpers/helpers';
import type { CreateCollectionFormValues } from '@/schemas/collectionSchema';
import { createCollectionSchema } from '@/schemas/collectionSchema';

interface CollectionFormProps {
  isLoading: boolean;
  onSubmit: (data: CreateCollectionFormValues) => void;
  isCreate?: boolean;
  defaultValues?: Partial<CreateCollectionFormValues>;
}

const { TextArea } = Input;

const { Paragraph } = Typography;

const CollectionForm: React.FC<CollectionFormProps> = ({
  isLoading,
  onSubmit,
  isCreate = true,
  defaultValues,
}) => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCollectionFormValues>({
    resolver: zodResolver(createCollectionSchema),
    defaultValues: {
      title: '',
      description: '',
      ...defaultValues,
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className='flex max-w-[700px] flex-col gap-4'
    >
      <div className='flex items-center justify-between border-b border-b-black/10 py-2'>
        <Paragraph className='m-0'>Collection name</Paragraph>
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
            <TextArea {...field} rows={4} className='max-w-[200px]' />
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
            {isLoading
              ? isCreate
                ? 'Creating...'
                : 'Updating...'
              : isCreate
                ? 'Create'
                : 'Update'}
          </Paragraph>
        </Button>
      </div>
    </form>
  );
};

export default CollectionForm;
