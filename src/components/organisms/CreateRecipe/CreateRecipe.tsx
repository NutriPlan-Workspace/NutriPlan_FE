import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { useCanGoBack, useRouter } from '@tanstack/react-router';
import { Typography } from 'antd';

import { Button } from '@/atoms/Button';
import { CreateRecipeForm } from '@/organisms/CreateRecipe';
import { removeCurrentCustomFood } from '@/redux/slices/food';

const { Paragraph } = Typography;

const CreateRecipe: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const canGoBack = useCanGoBack();

  return (
    <div className='flex flex-col gap-4'>
      <div className='fixed top-0 z-10 w-full bg-white px-[40px] pt-2 pb-10'>
        <Button
          className='ml-[-15px] flex w-[100px] items-center gap-2 rounded-full border-none hover:bg-gray-100'
          onClick={() => {
            dispatch(removeCurrentCustomFood());
            if (canGoBack) {
              router.history.back();
            }
          }}
        >
          <FaArrowLeft />
          <Paragraph className='m-0'>Cancel</Paragraph>
        </Button>

        <p className='mt-[10px] text-[27px]'>Create Custom Recipe</p>
      </div>

      <div className='pt-[120px]'>
        <CreateRecipeForm />
      </div>
    </div>
  );
};

export default CreateRecipe;
