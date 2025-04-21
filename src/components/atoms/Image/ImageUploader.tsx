import React from 'react';
import { IoCloudUpload } from 'react-icons/io5';
import { Typography } from 'antd';

import { Button } from '@/atoms/Button';

const { Paragraph } = Typography;

interface ImageUploaderProps {
  onClick: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onClick }) => (
  <div className='flex w-full items-center'>
    <Button
      className='flex h-[300px] w-full flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed bg-blue-200 hover:text-black'
      onClick={onClick}
    >
      <IoCloudUpload className='h-10 w-10 text-blue-500' />
      <div className='flex items-center gap-2'>
        <Paragraph className='text-blue-500'>Choose an image</Paragraph>
        <Paragraph>or drag in here</Paragraph>
      </div>
    </Button>
  </div>
);

export default ImageUploader;
