import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';

import { AnimatedSubtitle } from '@/atoms/AnimatedSubtitle';
import { AnimatedTitle } from '@/atoms/AnimatedTitle';
import { PATH } from '@/constants/path';
import { handleAdminRoute } from '@/utils/route';

export const Route = createFileRoute(
  PATH.ADMIN_SETTINGS as keyof FileRoutesByPath,
)({
  component: AdminSettingsPage,
  beforeLoad: handleAdminRoute,
});

function AdminSettingsPage() {
  return (
    <div className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-10'>
      <div className='mb-8'>
        <p className='text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase'>
          Admin
        </p>
        <AnimatedTitle className='mt-2 text-3xl font-bold text-slate-900'>
          Settings
        </AnimatedTitle>
        <AnimatedSubtitle className='mt-2 max-w-2xl text-sm text-slate-600'>
          Admin settings page (placeholder).
        </AnimatedSubtitle>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <div className='rounded-2xl border border-slate-200 bg-white p-6'>
          <p className='text-sm font-semibold text-slate-900'>Security</p>
          <p className='mt-1 text-sm text-slate-600'>
            Configure admin-only features and access policies.
          </p>
          <button
            type='button'
            disabled
            className='mt-4 inline-flex rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500'
          >
            Coming soon
          </button>
        </div>

        <div className='rounded-2xl border border-slate-200 bg-white p-6'>
          <p className='text-sm font-semibold text-slate-900'>Content</p>
          <p className='mt-1 text-sm text-slate-600'>
            Defaults for articles and public pages.
          </p>
          <button
            type='button'
            disabled
            className='mt-4 inline-flex rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-500'
          >
            Coming soon
          </button>
        </div>
      </div>
    </div>
  );
}
