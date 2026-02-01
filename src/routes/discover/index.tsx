import React, { useEffect, useMemo, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  createFileRoute,
  FileRoutesByPath,
  useNavigate,
} from '@tanstack/react-router';

import { PATH } from '@/constants/path';
import { DiscoverHeader } from '@/molecules/DiscoverHeader';
import { DiscoverContent } from '@/organisms/DiscoverContent';
import {
  useCreateCollectionMutation,
  useGetCuratedCollectionsQuery,
  useTrackCuratedCollectionCopyMutation,
} from '@/redux/query/apis/collection/collectionApi';
import { useLazyGetFoodsQuery } from '@/redux/query/apis/food/foodApis';
import HubPageShell from '@/templates/HubPageShell';
import type { Collection } from '@/types/collection';
import type { Food } from '@/types/food';
import type { FoodFilterQuery } from '@/types/foodFilterQuery';
import { handleUserRoute } from '@/utils/route';

const DiscoverPageContent: React.FC = () => {
  type CuratedCard = {
    _id?: string;
    title: string;
    description?: string;
    img?: string;
    foods?: Collection['foods'];
  };

  const [activeTab, setActiveTab] = useState<'foods' | 'collections'>('foods');
  const [page, setPage] = useState(1);
  const [foods, setFoods] = useState<Food[]>([]);
  const [filters, setFilters] = useState<Partial<FoodFilterQuery>>({});
  const [trigger, { data, isFetching }] = useLazyGetFoodsQuery();
  const [openModal, setOpenModal] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [curatedPage, setCuratedPage] = useState(1);
  const [curatedCollections, setCuratedCollections] = useState<Collection[]>(
    [],
  );
  const [hasMoreCurated, setHasMoreCurated] = useState(true);

  const curatedQueryArgs =
    activeTab === 'collections' ? { page: curatedPage, limit: 6 } : skipToken;
  const { data: curatedData, isFetching: isFetchingCurated } =
    useGetCuratedCollectionsQuery(curatedQueryArgs);
  const [createCollection] = useCreateCollectionMutation();
  const [trackCuratedCollectionCopy] = useTrackCuratedCollectionCopyMutation();
  const navigate = useNavigate();

  const handleFilterChange = (
    updatedFilter: Partial<FoodFilterQuery>,
    keysToRemove: (keyof FoodFilterQuery)[] = [],
  ) => {
    setHasMore(true);
    setFilters(() => {
      const cleaned = { ...updatedFilter };
      keysToRemove.forEach((key) => {
        delete cleaned[key];
      });
      return cleaned;
    });
    setPage(1);
    setFoods([]);
  };

  useEffect(() => {
    if (data?.data) {
      setFoods((prevFoods) => {
        const newFoods = data.data.filter(
          (food) => !prevFoods.some((prevFood) => prevFood._id === food._id),
        );
        if (newFoods.length < 8) {
          setHasMore(false);
        }
        return [...prevFoods, ...newFoods];
      });
    }
  }, [data]);

  useEffect(() => {
    if (!curatedData?.data?.items) return;
    setCuratedCollections((prev) => {
      const newItems = curatedData.data.items.filter(
        (collection) => !prev.some((item) => item._id === collection._id),
      );
      if (newItems.length < 6) {
        setHasMoreCurated(false);
      }
      return [...prev, ...newItems];
    });
  }, [curatedData]);

  useEffect(() => {
    const fetchFoods = () => {
      if (activeTab !== 'foods') return;
      trigger({ page, limit: 8, ...filters });
    };
    fetchFoods();
  }, [page, filters, trigger, activeTab]);

  const fallbackCurated = useMemo<CuratedCard[]>(
    () => [
      {
        title: 'Vietnamese Favorites',
        description: 'Classic Vietnamese comfort foods with balanced macros.',
        img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Thai Street Classics',
        description: 'Bold Thai flavors with a lighter nutrition profile.',
        img: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Quick Bento Boxes',
        description: 'Portion-friendly lunch sets for busy weekdays.',
        img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Lean & Green Bowls',
        description: 'Veg-forward bowls with high protein add-ons.',
        img: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Budget-Friendly Meals',
        description: 'Affordable dishes designed for weekly planning.',
        img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    [],
  );

  const curatedList: CuratedCard[] =
    curatedCollections.length > 0 ? curatedCollections : fallbackCurated;

  const handleCopyCollection = async (collection: CuratedCard) => {
    if (!collection._id) return;
    try {
      const response = await createCollection({
        title: `${collection.title} (Copy)`,
        description: collection.description,
        img: collection.img,
        foods: collection.foods?.map((item) => ({
          food: item.food,
          date: item.date,
        })),
      }).unwrap();
      if (response.data?._id) {
        trackCuratedCollectionCopy({
          collectionId: collection._id,
          destinationCollectionId: response.data._id,
          source: 'discover',
        });
        window.location.href = `/collections/${response.data._id}`;
      }
    } catch {
      // ignore for now
    }
  };

  return (
    <HubPageShell
      title='Discover'
      description='Browse foods and save them into your collections.'
      maxWidthClassName='max-w-7xl'
    >
      <div className='flex flex-col gap-5'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div>
            <p className='text-xs font-semibold tracking-[0.22em] text-slate-400 uppercase'>
              Explore
            </p>
            <p className='mt-2 text-sm text-slate-600'>
              Pick foods or curated collections prepared by admins.
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
                  setActiveTab(tab.value as 'foods' | 'collections')
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

        <div key={activeTab} className='discover-tab-panel'>
          {activeTab === 'foods' && (
            <DiscoverHeader
              openModal={openModal}
              setOpenModal={setOpenModal}
              onFilterChange={(newFilters, keysToRemove = []) => {
                handleFilterChange(newFilters, keysToRemove);
              }}
            />
          )}

          {activeTab === 'foods' ? (
            <DiscoverContent
              foods={foods}
              isFetching={isFetching}
              onLoadMore={() => setPage((prevPage) => prevPage + 1)}
              hasMore={hasMore}
            />
          ) : (
            <div className='space-y-6'>
              <div className='grid gap-5 md:grid-cols-2 lg:grid-cols-3'>
                {curatedList.map((collection, index) => (
                  <div
                    key={collection._id ?? `${collection.title}-${index}`}
                    role={collection._id ? 'button' : undefined}
                    tabIndex={collection._id ? 0 : -1}
                    onClick={() => {
                      if (!collection._id) return;
                      navigate({
                        to: '/collections/$id',
                        params: { id: collection._id },
                      });
                    }}
                    onKeyDown={(event) => {
                      if (!collection._id) return;
                      if (event.key !== 'Enter' && event.key !== ' ') return;
                      event.preventDefault();
                      navigate({
                        to: '/collections/$id',
                        params: { id: collection._id },
                      });
                    }}
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
                    {collection._id && (
                      <div className='flex items-center gap-2 px-5 pb-5'>
                        <button
                          type='button'
                          onClick={() =>
                            navigate({
                              to: '/collections/$id',
                              params: { id: collection._id },
                            })
                          }
                          className='text-xs font-semibold text-emerald-700 hover:underline'
                        >
                          View details
                        </button>
                        <button
                          type='button'
                          onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                            handleCopyCollection(collection);
                          }}
                          className='text-xs font-semibold text-slate-600 hover:text-slate-800'
                        >
                          Make a copy
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                {!isFetchingCurated && curatedList.length === 0 && (
                  <div className='rounded-3xl border border-white/70 bg-white/90 p-6 text-sm text-gray-600 md:col-span-2 lg:col-span-3'>
                    No curated collections yet.
                  </div>
                )}
              </div>

              {curatedCollections.length > 0 && hasMoreCurated && (
                <div className='flex justify-center'>
                  <button
                    type='button'
                    onClick={() => setCuratedPage((prev) => prev + 1)}
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
      </div>
    </HubPageShell>
  );
};

const DiscoverPage: React.FC = () => <DiscoverPageContent />;

export const Route = createFileRoute(PATH.DISCOVER as keyof FileRoutesByPath)({
  component: DiscoverPage,
  beforeLoad: handleUserRoute,
});
