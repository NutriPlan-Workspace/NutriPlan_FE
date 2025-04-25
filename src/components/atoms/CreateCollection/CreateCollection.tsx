import React from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { useRouter } from '@tanstack/react-router';
import { Typography } from 'antd';
import { motion } from 'framer-motion';

import { HTTP_STATUS } from '@/constants/httpStatus';
import { ERROR_MESSAGES } from '@/constants/message';
import { useToast } from '@/contexts/ToastContext';
import { useCreateCollectionMutation } from '@/redux/query/apis/collection/collectionApi';
import type { CreateCollectionFormValues } from '@/schemas/collectionSchema';

import CollectionForm from './CollectionForm';

const { Title } = Typography;

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToastError(ERROR_MESSAGES.CREATE_COLLECTION_FAILED);
    }
  };

  return (
    <motion.div
      className='m-5 flex flex-col gap-4'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75, ease: 'easeOut' }}
    >
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-4'>
          <FaArrowLeft
            onClick={() => router.history.back()}
            className='hover:text-primary cursor-pointer transition'
          />
          <Title level={3} className='m-0 font-thin'>
            Create Collection
          </Title>
        </div>
        <CollectionForm isLoading={isLoading} onSubmit={onSubmit} />
      </div>
    </motion.div>
  );
};

export default CreateCollection;
