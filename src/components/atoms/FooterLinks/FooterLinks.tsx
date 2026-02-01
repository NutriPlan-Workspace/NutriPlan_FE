import React from 'react';
import { Link } from '@tanstack/react-router';

import { PUBLIC_NAV_ITEMS } from '@/constants/navigation';
import { PATH } from '@/constants/path';
import { useGetArticlesQuery } from '@/redux/query/apis/articles/articlesApi';

const FooterLinks: React.FC = () => (
  <div className='flex w-full flex-wrap gap-10'>
    <ul className='flex max-w-[296px] flex-col gap-[16px]'>
      <li className='text-[12px] font-semibold tracking-[0.2em] text-slate-400 uppercase'>
        Pages
      </li>
      {PUBLIC_NAV_ITEMS.map((item) => (
        <li key={item.path} className='text-[14px] font-medium text-slate-300'>
          <Link to={item.path} className='hover:text-white hover:underline'>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>

    <FooterArticles />
  </div>
);

const FooterArticles: React.FC = () => {
  const { data, isLoading } = useGetArticlesQuery({ limit: 3 });
  const items = data?.data?.items ?? [];

  return (
    <ul className='flex max-w-[320px] flex-col gap-[16px]'>
      <li className='text-[12px] font-semibold tracking-[0.2em] text-slate-400 uppercase'>
        Articles
      </li>
      {isLoading && (
        <li className='text-[14px] font-medium text-slate-300'>Loading…</li>
      )}
      {!isLoading && items.length === 0 && (
        <li className='text-[14px] font-medium text-slate-300'>
          No articles yet.
        </li>
      )}
      {items.map((a) => (
        <li key={a.id} className='text-[14px] font-medium text-slate-300'>
          <Link
            to={PATH.ARTICLE_DETAIL.replace('$slug', a.slug)}
            className='hover:text-white hover:underline'
          >
            {a.title}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default FooterLinks;
