import React, { useCallback, useRef, useState } from 'react';
import { Area } from 'react-easy-crop';
import { Modal, Typography } from 'antd';

import { ImageCropper, ImageUploader } from '@/atoms/Image';
import { ERROR_MESSAGES } from '@/constants/message';
import { useToast } from '@/contexts/ToastContext';
import { useUploadImageMutation } from '@/redux/query/apis/cloudinary/cloudinaryApi';
import { getCroppedImg } from '@/utils/image';

interface PopupUploadProps {
  isModalOpen: boolean;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onUploaded: (url: string) => void;
}

const { Title } = Typography;

const PopupUpload: React.FC<PopupUploadProps> = ({
  isModalOpen,
  setModalOpen,
  onUploaded,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [uploadImage] = useUploadImageMutation();
  const { showToastError } = useToast();
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleRemoveImage = () => {
    setImage(null);
    setZoom(1);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const getCroppedImage = async () => {
    if (!image || !croppedAreaPixels) return;
    try {
      setLoading(true);
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels);
      const file = new File([croppedBlob], 'cropped-image.jpg', {
        type: 'image/jpeg',
      });
      const url = await uploadImage(file).unwrap();
      onUploaded?.(url);
      handleRemoveImage();
      setModalOpen(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showToastError(ERROR_MESSAGES.IMAGE_UPLOAD_FAILED);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width={600}
      >
        <Title level={3} className='font-thin'>
          Upload Image
        </Title>

        <input
          type='file'
          accept='image/*'
          ref={inputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {!image ? (
          <ImageUploader onClick={() => inputRef.current?.click()} />
        ) : (
          <ImageCropper
            image={image}
            crop={crop}
            zoom={zoom}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            onUpload={getCroppedImage}
            onRemove={handleRemoveImage}
            loading={loading}
          />
        )}
      </Modal>
    </>
  );
};

export default PopupUpload;
