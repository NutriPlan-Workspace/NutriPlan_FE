import React from 'react';

import { useGetPantrySuggestionsQuery } from '@/redux/query/apis/pantry/pantryApi';

const PantrySuggestionsDock: React.FC = () => {
  const { data } = useGetPantrySuggestionsQuery({ limit: 4 });
  const suggestions = data?.data ?? [];

  return (
    <div className='mt-4 rounded-2xl border border-white/30 bg-white/70 p-3 shadow-[0_10px_28px_-24px_rgba(16,24,40,0.55)]'>
      <p className='text-[11px] font-semibold tracking-[0.2em] text-slate-400 uppercase'>
        Suggestions from pantry
      </p>
      <div className='mt-2 space-y-2'>
        {suggestions.length === 0 && (
          <p className='text-xs text-gray-500'>No suggestions yet.</p>
        )}
        {suggestions.map((item) => (
          <div
            key={item._id}
            className='flex items-center gap-3 rounded-xl border border-white/60 bg-white/80 p-2'
          >
            <div className='h-10 w-10 overflow-hidden rounded-lg bg-gray-100'>
              {item.imgUrls?.[0] ? (
                <img
                  src={item.imgUrls[0]}
                  alt={item.name}
                  className='h-full w-full object-cover'
                />
              ) : null}
            </div>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-xs font-semibold text-gray-900'>
                {item.name}
              </p>
              {item.matchCount !== undefined && (
                <p className='text-[11px] text-gray-500'>
                  {item.matchCount} matches
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PantrySuggestionsDock;
