import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { Button, Typography } from 'antd';

import defaultImage from '@/assets/default_img.svg';
import {
  ControlledInput,
  ControlledTextArea,
  FormRow,
} from '@/molecules/FormRow';
import { PopupUpload } from '@/molecules/PopupUpload';
import { FoodFormSchema } from '@/schemas/recipeSchema';

const { Paragraph } = Typography;

type Props = {
  control: Control<FoodFormSchema>;
  errors: FieldErrors<FoodFormSchema>;
  img?: string;
  upload: boolean;
  setUpload: React.Dispatch<React.SetStateAction<boolean>>;
  handleUploaded: (url: string) => void;
};

const RecipeBasicInfoSection: React.FC<Props> = ({
  control,
  errors,
  img,
  upload,
  setUpload,
  handleUploaded,
}) => (
  <>
    <FormRow label='Name'>
      <ControlledInput
        name='name'
        control={control}
        error={errors.name?.message}
      />
    </FormRow>

    <FormRow label='Description'>
      <ControlledTextArea
        name='description'
        control={control}
        error={errors.description?.message}
      />
    </FormRow>

    <FormRow label='Image' isEnd={true}>
      <div className='flex flex-col items-center gap-4'>
        <img src={img || defaultImage} alt='default' className='h-30 w-30' />
        <Button
          className='flex items-center gap-2'
          onClick={() => setUpload((prev) => !prev)}
        >
          <IoCloudUploadOutline />
          <Paragraph className='m-0'>Upload Image</Paragraph>
        </Button>
        <PopupUpload
          isModalOpen={upload}
          setModalOpen={setUpload}
          onUploaded={handleUploaded}
        />
      </div>
    </FormRow>
  </>
);

export default RecipeBasicInfoSection;
