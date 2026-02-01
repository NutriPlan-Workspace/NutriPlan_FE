import React from 'react';
import { motion } from 'framer-motion';

import SearchInput from '@/molecules/BrowseFoodContent/SearchInput';
import FoodGrid from '@/organisms/FoodGrid/FoodGrid';
import type { Collection } from '@/types/collection';
import type { Food } from '@/types/food';
import type { FoodFilterQuery } from '@/types/foodFilterQuery';

interface BrowseFoodTemplateProps {
  foods: Food[];
  isFetching: boolean;
  onLoadMore: () => void;
  onFilterChange?: (
    newFilters: Partial<FoodFilterQuery>,
    keysToRemove?: (keyof FoodFilterQuery)[],
  ) => void;
  isLastPage: boolean;
  activeTab: 'foods' | 'collections';
  onTabChange: (tab: 'foods' | 'collections') => void;
  curatedCollections?: Collection[];
  isFetchingCurated?: boolean;
  onLoadMoreCurated?: () => void;
  hasMoreCurated?: boolean;
}

const heroContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const BrowseFoodTemplate: React.FC<BrowseFoodTemplateProps> = ({
  foods,
  isFetching,
  onLoadMore,
  onFilterChange,
  isLastPage,
  activeTab,
  onTabChange,
  curatedCollections = [],
  isFetchingCurated = false,
  onLoadMoreCurated,
  hasMoreCurated = false,
}) => (
  <div className='min-h-screen bg-slate-50'>
    <section className='relative overflow-hidden bg-white'>
      <div className='absolute -top-20 -right-24 h-72 w-72 rounded-full bg-emerald-100/70 blur-[120px]' />
      <div className='absolute top-24 -left-32 h-72 w-72 rounded-full bg-sky-100/70 blur-[120px]' />

      <div className='mx-auto w-full max-w-7xl px-6 py-12 lg:px-10 xl:px-24'>
        <motion.div
          variants={heroContainer}
          initial='hidden'
          animate='show'
          className='grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]'
        >
          <motion.div variants={heroItem}>
            <span className='text-xs font-semibold tracking-[0.3em] text-emerald-600 uppercase'>
              Browse foods
            </span>
            <h1 className='entry-title mt-4 text-4xl font-semibold text-gray-900 md:text-5xl'>
              Discover meals curated for your goals
            </h1>
            <p className='mt-4 max-w-xl text-base text-gray-600'>
              Explore healthy meals, plan-friendly recipes, and nutrition facts
              in one place. Filter by diet style, calories, or ingredients and
              find your next favorite dish.
            </p>
            <div className='mt-6 flex flex-wrap gap-4 text-sm text-gray-600'>
              {[
                {
                  label: '4.5K+ meals',
                  className: 'border-emerald-200 bg-emerald-50',
                },
                {
                  label: 'Updated weekly',
                  className: 'border-gray-200 bg-white',
                },
                {
                  label: 'Verified nutrition',
                  className: 'border-gray-200 bg-white',
                },
              ].map((pill) => (
                <motion.div
                  key={pill.label}
                  variants={heroItem}
                  className={`rounded-full border px-4 py-2 ${pill.className}`}
                >
                  {pill.label}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={heroItem}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 220, damping: 18 }}
            className='relative overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_24px_60px_-36px_rgba(16,24,40,0.35)]'
          >
            <img
              className='h-72 w-full object-cover md:h-80'
              src='https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80'
              alt='Browse foods banner'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
            <div className='absolute bottom-5 left-5 rounded-2xl border border-white/30 bg-white/80 px-4 py-3 text-sm font-semibold text-gray-900 backdrop-blur'>
              Plan smarter, eat better
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>

    <section className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-10 xl:px-24'>
      <div className='rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_24px_60px_-36px_rgba(16,24,40,0.2)]'>
        <div className='mb-6 flex flex-col items-center justify-between gap-4 md:flex-row'>
          <div>
            <h2 className='text-2xl font-semibold text-gray-900 md:text-3xl'>
              What&apos;s cooking near you
            </h2>
            <p className='mt-2 text-sm text-gray-500'>
              This is a sample menu — the meals shown are subject to
              availability.
            </p>
          </div>

          <div className='border-secondary-200 bg-secondary-50/70 flex items-center rounded-full border p-1 shadow-[0_6px_16px_-12px_rgba(15,23,42,0.35)]'>
            {[
              { label: 'Foods', value: 'foods' },
              { label: 'Curated collections', value: 'collections' },
            ].map((tab) => (
              <button
                key={tab.value}
                type='button'
                onClick={() =>
                  onTabChange(tab.value as 'foods' | 'collections')
                }
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  activeTab === tab.value
                    ? 'bg-secondary-400 text-white shadow-[0_10px_24px_-16px_rgba(100,157,173,0.5)]'
                    : 'text-secondary-700 hover:text-secondary-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'foods' ? (
          <>
            <SearchInput onFilterChange={onFilterChange} />

            <div className='mt-8'>
              <FoodGrid
                foods={foods}
                isFetching={isFetching}
                onLoadMore={onLoadMore}
                isLastPage={isLastPage}
              />
            </div>
          </>
        ) : (
          <div className='mt-8 space-y-6'>
            <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
              {curatedCollections.map((collection, index) => (
                <a
                  key={collection._id ?? `${collection.title}-${index}`}
                  href={collection._id ? `/collections/${collection._id}` : '#'}
                  className='group overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_64px_-40px_rgba(16,24,40,0.45)]'
                >
                  {collection.img ? (
                    <img
                      src={collection.img}
                      alt={collection.title}
                      className='h-40 w-full object-cover transition duration-500 group-hover:scale-105'
                      loading='lazy'
                    />
                  ) : (
                    <div className='h-40 w-full bg-gradient-to-br from-emerald-100 via-white to-sky-100' />
                  )}
                  <div className='p-5'>
                    <p className='m-0 text-sm font-semibold text-gray-900'>
                      {collection.title}
                    </p>
                    {collection.description && (
                      <p className='mt-2 text-xs text-gray-600'>
                        {collection.description}
                      </p>
                    )}
                    {collection.foods && (
                      <p className='mt-3 text-xs font-semibold text-emerald-700'>
                        {collection.foods.length} foods
                      </p>
                    )}
                  </div>
                  <div className='flex items-center gap-2 px-5 pb-5'>
                    <span className='text-xs font-semibold text-emerald-700 hover:underline'>
                      View details
                    </span>
                  </div>
                </a>
              ))}

              {!isFetchingCurated && curatedCollections.length === 0 && (
                <div className='rounded-3xl border border-white/70 bg-white/90 p-6 text-sm text-gray-600 md:col-span-2 lg:col-span-3'>
                  No curated collections available.
                </div>
              )}
            </div>

            {hasMoreCurated && (
              <div className='flex justify-center'>
                <button
                  type='button'
                  onClick={onLoadMoreCurated}
                  className='rounded-full border border-emerald-200 bg-white px-5 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50'
                  disabled={isFetchingCurated}
                >
                  {isFetchingCurated ? 'Loading...' : 'Load more collections'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  </div>
);

export default BrowseFoodTemplate;
