import React from 'react';
import { Button, Modal } from 'antd';

import type { NutritionGoalResponse } from '@/types/user';

interface NutritionTargetModalProps {
  isModalVisible: boolean;
  onCancel: () => void;
  oldTarget: NutritionGoalResponse | undefined;
  newTarget: NutritionGoalResponse | undefined;
  handleSave: () => void;
}

const NutritionTargetModal: React.FC<NutritionTargetModalProps> = ({
  isModalVisible,
  onCancel,
  oldTarget,
  newTarget,
  handleSave,
}) => (
  <Modal
    className='detail-modal'
    title='Update Nutrition Targets'
    open={isModalVisible}
    onCancel={onCancel}
    footer={[
      <div key='save-footer' className='flex w-full justify-center'>
        <Button
          key='save'
          className='border-none bg-[#ffc84e] px-6 py-5 text-[16px] font-bold text-black hover:bg-[#ffb81c]'
          onClick={() => {
            handleSave();
            onCancel();
          }}
        >
          Save
        </Button>
      </div>,
    ]}
  >
    <div className='grid grid-cols-3 gap-4'>
      <div>
        <h3 className='mb-2 text-lg font-semibold'>Nutrients</h3>
        <p>
          <strong>Calories:</strong>
        </p>
        <p>
          <span className='inline-block h-2 w-2 rounded-full bg-yellow-400'></span>{' '}
          Carbs:
        </p>

        <p>
          <span className='inline-block h-2 w-2 rounded-full bg-blue-400'></span>{' '}
          Fat:
        </p>
        <p>
          <span className='inline-block h-2 w-2 rounded-full bg-purple-400'></span>{' '}
          Protein:
        </p>
      </div>

      <div>
        <h3 className='mb-2 text-lg font-semibold'>Current</h3>
        <p>{oldTarget?.data?.calories}</p>
        <p>{`${oldTarget?.data?.carbTarget?.from} - ${oldTarget?.data?.carbTarget?.to}g`}</p>
        <p>{`${oldTarget?.data?.fatTarget?.from} - ${oldTarget?.data?.fatTarget?.to}g`}</p>
        <p>{`${oldTarget?.data?.proteinTarget?.from} - ${oldTarget?.data?.proteinTarget?.to}g`}</p>
      </div>

      <div>
        <h3 className='mb-2 text-lg font-semibold'>Suggested</h3>
        <p>{newTarget?.data?.calories}</p>
        <p>{`${newTarget?.data?.carbTarget.from} - ${newTarget?.data?.carbTarget?.to}g`}</p>
        <p>{`${newTarget?.data?.fatTarget.from} - ${newTarget?.data?.fatTarget?.to}g`}</p>
        <p>{`${newTarget?.data?.proteinTarget.from} - ${newTarget?.data?.proteinTarget?.to}g`}</p>
      </div>
    </div>
  </Modal>
);

export default NutritionTargetModal;
