import React from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Slider, Typography } from 'antd';

import { Button } from '@/atoms/Button';

const { Paragraph } = Typography;

interface ImageCropperProps {
  image: string;
  crop: { x: number; y: number };
  zoom: number;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (_: Area, croppedAreaPixels: Area) => void;
  onUpload: () => void;
  onRemove: () => void;
  loading: boolean;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  image,
  crop,
  zoom,
  onCropChange,
  onZoomChange,
  onCropComplete,
  onUpload,
  onRemove,
  loading,
}) => (
  <>
    <div className='relative h-[300px] w-full bg-gray-200'>
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={onCropChange}
        onZoomChange={onZoomChange}
        onCropComplete={onCropComplete}
      />
    </div>
    <div className='my-4'>
      <Paragraph>Zoom</Paragraph>
      <Slider
        min={1}
        max={3}
        step={0.1}
        value={zoom}
        onChange={(value) => onZoomChange(value)}
      />
    </div>
    <div className='flex items-center justify-center gap-4'>
      <Button
        className='border-primary text-primary hover:border-primary hover:text-primary'
        onClick={onUpload}
        loading={loading}
      >
        Save and Upload
      </Button>
      <Button
        className='border-red-500 text-red-500 hover:border-red-500 hover:text-red-500'
        onClick={onRemove}
      >
        Remove Image
      </Button>
    </div>
  </>
);

export default ImageCropper;
