import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useCanGoBack, useRouter } from '@tanstack/react-router';
import { Typography } from 'antd';

import { Button } from '@/atoms/Button';
import { CreateRecipeForm } from '@/organisms/CreateRecipe';

const { Title, Paragraph } = Typography;

const CreateRecipe: React.FC = () => {
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (
    <div className='flex flex-col gap-4 p-5'>
      <div className='fixed top-0 z-10 w-full bg-white pb-10'>
        <Button
          className='ml-[-15px] flex w-[100px] items-center gap-2 rounded-full border-none hover:bg-gray-100'
          onClick={() => {
            if (canGoBack) {
              router.history.back();
            }
          }}
        >
          <FaArrowLeft />
          <Paragraph className='m-0'>Cancel</Paragraph>
        </Button>

        <Title level={3} className='m-0 font-thin'>
          Create Custom Recipe
        </Title>
      </div>

      <div className='pt-[120px]'>
        <CreateRecipeForm />
      </div>
    </div>
  );
};

export default CreateRecipe;
