import React from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useRouter } from '@tanstack/react-router';
import { motion } from 'motion/react';

import { HTTP_STATUS } from '@/constants/httpStatus';
import { ERROR_MESSAGES } from '@/constants/message';
import { useToast } from '@/contexts/ToastContext';
import { useCreateCollectionMutation } from '@/redux/query/apis/collection/collectionApi';
import type { CreateCollectionFormValues } from '@/schemas/collectionSchema';
import HubPageShell from '@/templates/HubPageShell';

import CollectionForm from './CollectionForm';

const CreateCollection: React.FC = () => {
  const router = useRouter();
  const [createCollection, { isLoading }] = useCreateCollectionMutation();
  const { showToastError } = useToast();

  const onSubmit = async (data: CreateCollectionFormValues) => {
    try {
      const response = await createCollection(data).unwrap();
      if (response.code === HTTP_STATUS.OK) {
        router.history.back();
        return;
      }
      showToastError(ERROR_MESSAGES.CREATE_COLLECTION_FAILED);
    } catch {
      showToastError(ERROR_MESSAGES.CREATE_COLLECTION_FAILED);
    }
  };

  return (
    <motion.div
      className='w-full'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
    >
      <HubPageShell
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
            <span>Create Collection</span>
          </span>
        }
        description='Create a new collection to organize foods and recipes.'
        maxWidthClassName='max-w-3xl'
      >
        <div className='pt-1'>
          <CollectionForm isLoading={isLoading} onSubmit={onSubmit} />
        </div>
      </HubPageShell>
    </motion.div>
  );
};

export default CreateCollection;
