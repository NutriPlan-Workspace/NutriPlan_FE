import React from 'react';
import { IoClose } from 'react-icons/io5';
import { Modal } from 'antd';

import type { NutritionFields } from '@/types/food';

import { DetailedNutriTable } from '../DetailedNutriTable';

type ModalNutritionDetailProps = {
  nutrition: NutritionFields | undefined;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  type?: string;
};

const ModalNutritionDetail: React.FC<ModalNutritionDetailProps> = ({
  nutrition,
  isModalOpen,
  setIsModalOpen,
  type = 'food',
}) => (
  <Modal
    title={null}
    open={isModalOpen}
    closable={false}
    footer={null}
    onCancel={() => setIsModalOpen(false)}
    centered
    width={720}
    styles={{
      content: {
        padding: 0,
        borderRadius: 24,
        overflow: 'hidden',
      },
      body: {
        padding: 0,
      },
    }}
  >
    <div className='border border-black/5 bg-white/85 shadow-[0_26px_70px_-42px_rgba(16,24,40,0.55)] backdrop-blur'>
      <div className='sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-black/5 bg-white/80 px-6 py-4 backdrop-blur'>
        <div className='min-w-0'>
          <div className='text-lg font-semibold text-gray-900'>
            Detailed Nutrition
          </div>
          <div className='mt-0.5 text-sm text-gray-500'>
            Breakdown of nutrients, vitamins, and more.
          </div>
        </div>

        <button
          type='button'
          onClick={() => setIsModalOpen(false)}
          className='inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-black/5 bg-white/70 text-gray-600 shadow-sm transition hover:bg-white'
          aria-label='Close'
        >
          <IoClose size={18} />
        </button>
      </div>

      <div className='max-h-[78vh] overflow-y-auto px-6 py-5'>
        {nutrition && <DetailedNutriTable nutrition={nutrition} type={type} />}
      </div>
    </div>
  </Modal>
);

export default ModalNutritionDetail;
