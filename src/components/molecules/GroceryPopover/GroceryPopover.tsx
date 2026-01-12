import type { IngreResponse } from '@/types/mealPlan';
import { formatToDayAndDate } from '@/utils/dateUtils';
import { roundNumber } from '@/utils/roundNumber';

interface GroceryPopoverProps {
  data: IngreResponse;
}

const GroceryPopover = ({ data }: GroceryPopoverProps) => {
  const imageUrl =
    data.imgUrls?.[0] ||
    'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif';

  const calories = roundNumber(data.nutrition.calories ?? 0, 0);
  const proteins = roundNumber(data.nutrition.proteins ?? 0, 0);
  const carbs = roundNumber(data.nutrition.carbs ?? 0, 0);
  const fats = roundNumber(data.nutrition.fats ?? 0, 0);

  const unitLabel = data.unit?.description?.toUpperCase?.() ?? '';
  const totalAmountLabel =
    `${roundNumber(data.totalAmount ?? 0, 2)} ${unitLabel}`.trim();

  return (
    <div className='w-[320px] overflow-hidden rounded-[34px] border border-white/60 bg-white/90 shadow-[0_24px_56px_-42px_rgba(16,24,40,0.55)] backdrop-blur'>
      {/* Hero image (same layout as Mealplan popover) */}
      <div className='relative h-[380px] rounded-t-[34px]'>
        <img
          src={imageUrl}
          alt={data.name}
          className='h-full w-full rounded-t-[34px] object-cover'
          loading='lazy'
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif';
          }}
        />
        <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10' />
        <div className='pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 via-black/20 to-transparent' />

        <div className='absolute top-4 right-4'>
          <div className='rounded-full border border-white/20 bg-white/22 px-4 py-2 text-[12px] font-semibold text-white backdrop-blur-md'>
            {totalAmountLabel ? `TOTAL ${totalAmountLabel}` : 'TOTAL'}
          </div>
        </div>

        <div className='absolute inset-x-4 bottom-42 text-white'>
          <div className='inline-flex items-center rounded-full border border-white/25 bg-black/30 px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] text-white/90 uppercase backdrop-blur-md'>
            Ingredient
          </div>
          <div className='mt-2 line-clamp-2 text-[24px] leading-[1.2] font-bold drop-shadow-sm'>
            {data.name}
          </div>
        </div>

        <div className='absolute inset-x-4 bottom-16'>
          <div className='rounded-[28px] bg-gradient-to-b from-[#4a5560]/85 to-[#1f2a33]/85 p-4 shadow-[0_26px_70px_-42px_rgba(0,0,0,0.75)] backdrop-blur-md'>
            <div className='flex items-center gap-4'>
              <div className='min-w-0 flex-1'>
                <div className='text-[10px] font-semibold tracking-[0.2em] text-white/70'>
                  CALORIES
                </div>
                <div className='mt-1 flex items-end gap-2'>
                  <div className='text-[38px] leading-none font-extrabold text-white'>
                    {calories}
                  </div>
                  <div className='pb-[4px] text-[13px] font-semibold text-white/80'>
                    kcal
                  </div>
                </div>
              </div>

              <div className='ml-auto grid grid-cols-3 gap-3 text-white'>
                <div className='text-center'>
                  <div
                    className='text-[12px] font-extrabold'
                    style={{ color: 'var(--color-proteinsPurple)' }}
                  >
                    P
                  </div>
                  <div className='mt-1 text-[13px] font-extrabold'>
                    {proteins}g
                  </div>
                  <div
                    className='mx-auto mt-1 h-[2px] w-6 rounded-full opacity-90'
                    style={{ backgroundColor: 'var(--color-proteinsPurple)' }}
                  />
                </div>

                <div className='text-center'>
                  <div
                    className='text-[12px] font-extrabold'
                    style={{ color: 'var(--color-carbsYellow)' }}
                  >
                    C
                  </div>
                  <div className='mt-1 text-[13px] font-extrabold'>
                    {carbs}g
                  </div>
                  <div
                    className='mx-auto mt-1 h-[2px] w-6 rounded-full opacity-90'
                    style={{ backgroundColor: 'var(--color-carbsYellow)' }}
                  />
                </div>

                <div className='text-center'>
                  <div
                    className='text-[12px] font-extrabold'
                    style={{ color: 'var(--color-fatsBlue)' }}
                  >
                    F
                  </div>
                  <div className='mt-1 text-[13px] font-extrabold'>{fats}g</div>
                  <div
                    className='mx-auto mt-1 h-[2px] w-6 rounded-full opacity-90'
                    style={{ backgroundColor: 'var(--color-fatsBlue)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content: replace Mealplan Categories block with Used In */}
      <div className='relative -mt-12 rounded-[34px] border-t border-white/80 bg-white px-4 pt-3 pb-4'>
        <div className='mx-auto h-1.5 w-12 rounded-full bg-gray-200' />

        {data.foodDetails.length > 0 && (
          <div className='mt-3 rounded-3xl border border-gray-100 bg-white p-3 shadow-[0_10px_30px_-28px_rgba(16,24,40,0.15)]'>
            <div className='text-[11px] font-semibold tracking-widest text-gray-500'>
              USED IN
            </div>
            <div className='scrollbar-thin mt-2 max-h-[100px] space-y-3 overflow-auto pr-1'>
              {data.foodDetails.map((food, index) => (
                <div key={index} className='rounded-2xl bg-gray-50/80 p-2'>
                  <p className='text-[11px] font-semibold text-gray-500'>
                    {formatToDayAndDate(food.date)}
                  </p>
                  <div className='mt-2 flex items-center gap-3'>
                    <img
                      src={
                        food.imgUrls?.[0] ||
                        'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif'
                      }
                      alt={food.name}
                      className='h-14 w-14 rounded-2xl object-cover'
                      loading='lazy'
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src =
                          'https://res.cloudinary.com/dtwrwvffl/image/upload/v1746510206/k52mpavgekiqflwmk9ex.avif';
                      }}
                    />
                    <div className='min-w-0'>
                      <p className='truncate text-[13px] font-semibold text-gray-800'>
                        {food.name}
                      </p>
                      <p className='text-[12px] text-gray-500'>
                        {roundNumber(food.amount, 2)} {food.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default GroceryPopover;
