import React from 'react';
import { useSelector } from 'react-redux';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import PopupButton from '@/atoms/Button/PopupButton';
import { NutritionTargetModal } from '@/atoms/NutritionTargetModal';
import { PATH } from '@/constants/path';
import { useNutritionTargetsPrompt } from '@/hooks/useNutritionTargetsPrompt';
import { PhysicalStats } from '@/organisms/PhysicalStats';
import { WeightAndGoal } from '@/organisms/WeightAndGoal';
import { userSelector } from '@/redux/slices/user';
import UserHubPageShell from '@/templates/UserHubPageShell';
import { handleUserRoute } from '@/utils/route';

const PhysicalStatsPage: React.FC = () => {
  const userId = useSelector(userSelector).user.id;
  const targets = useNutritionTargetsPrompt({ userId });

  return (
    <UserHubPageShell
      title='Body & Goal'
      description='Keep your body profile up to date, then adjust your goal based on progress.'
      actions={
        <div className='flex flex-wrap items-center gap-2'>
          {targets.isPromptVisible && (
            <div className='inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50/70 px-3 py-2 text-xs font-semibold text-amber-900'>
              <span className='h-2 w-2 rounded-full bg-amber-500' />
              Stats updated — update targets
            </div>
          )}
          <PopupButton
            mode='action'
            variant='userHub'
            onClick={targets.openModal}
            label='Update targets based on current stats'
          />
        </div>
      }
    >
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
        <section className='rounded-3xl border border-rose-100/70 bg-white/70 p-6 shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)] backdrop-blur-2xl sm:p-7 lg:col-span-8'>
          <div className='mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>
              Physical Stats
            </h2>
            <p className='mt-1 text-sm text-gray-600'>
              Sex, height, birthday, body fat, and activity.
            </p>
          </div>
          <PhysicalStats
            embedded
            showTitle={false}
            hideWeight
            onTargetsChanged={targets.notifyTargetsChanged}
          />
        </section>

        <div className='flex flex-col gap-6 lg:col-span-4'>
          <section className='rounded-3xl border border-rose-100/70 bg-white/70 p-6 shadow-[0_16px_44px_-36px_rgba(16,24,40,0.28)] backdrop-blur-2xl sm:p-7 lg:sticky lg:top-24'>
            <div className='mb-4'>
              <h2 className='text-lg font-semibold text-gray-900'>
                Today’s Check-in
              </h2>
              <p className='mt-1 text-sm text-gray-600'>
                Update weight, then adjust your goal.
              </p>
            </div>

            <WeightAndGoal
              embedded
              showTitle={false}
              goalType={targets.goalType}
              onGoalTypeChange={targets.changeGoalType}
              onTargetsChanged={targets.notifyTargetsChanged}
            />

            <div className='mt-6 rounded-2xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-gray-700'>
              <div className='font-semibold text-[#e86852]'>Quick note</div>
              <p className='mt-1 text-gray-600'>
                After you update weight, your nutrition targets can be
                recalculated and saved from the popup.
              </p>
            </div>
          </section>
        </div>
      </div>

      <NutritionTargetModal
        isModalVisible={targets.isModalVisible}
        onCancel={targets.closeModal}
        oldTarget={targets.oldTarget}
        newTarget={targets.newTarget}
        handleSave={targets.saveSuggestedTargets}
      />
    </UserHubPageShell>
  );
};
export const Route = createFileRoute(
  PATH.PHYSICAL_STATS as keyof FileRoutesByPath,
)({
  component: PhysicalStatsPage,
  beforeLoad: handleUserRoute,
});
