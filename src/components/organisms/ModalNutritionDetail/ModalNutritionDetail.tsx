import React from 'react';
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
    className='detail-modal'
    title='Detailed Nutrition'
    open={isModalOpen}
    closable={true}
    footer={<></>}
    onCancel={() => setIsModalOpen(false)}
    width={550}
  >
    {nutrition && <DetailedNutriTable nutrition={nutrition} type={type} />}
  </Modal>
);

export default ModalNutritionDetail;
