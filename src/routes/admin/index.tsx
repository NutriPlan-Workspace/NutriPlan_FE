import {
  createFileRoute,
  FileRoutesByPath,
  Link,
} from '@tanstack/react-router';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { AnimatedSubtitle } from '@/atoms/AnimatedSubtitle';
import { AnimatedTitle } from '@/atoms/AnimatedTitle';
import { PATH } from '@/constants/path';
import { useGetAdminDashboardStatsQuery } from '@/redux/query/apis/admin/adminAnalyticsApi';
import type { AdminDashboardTimeSeriesPoint } from '@/types/analytics';
import { handleAdminRoute } from '@/utils/route';

export const Route = createFileRoute(PATH.ADMIN as keyof FileRoutesByPath)({
  component: AdminPage,
  beforeLoad: handleAdminRoute,
});

function AdminPage() {
  const { data, isLoading } = useGetAdminDashboardStatsQuery();
  const stats = data?.data;
  const timeSeries = stats?.timeSeries;

  const formatShortDate = (value: string) => {
    const [, month, day] = value.split('-');
    return `${day}/${month}`;
  };

  const computeTrend = (series?: AdminDashboardTimeSeriesPoint[]) => {
    const points = series ?? [];
    if (points.length === 0) {
      return { prev: 0, curr: 0, delta: 0, percent: 0, isNew: false };
    }

    const lastPoint = points.at(-1);
    const prevPoint = points.at(-2);
    const curr = Number(lastPoint?.value ?? 0);
    const prev = Number(prevPoint?.value ?? 0);
    const delta = curr - prev;

    if (prev === 0) {
      return {
        prev,
        curr,
        delta,
        percent: curr === 0 ? 0 : 100,
        isNew: curr > 0,
      };
    }

    const percent = Math.round((delta / prev) * 100);
    return { prev, curr, delta, percent, isNew: false };
  };

  const TrendBadge = ({
    series,
  }: {
    series?: AdminDashboardTimeSeriesPoint[];
  }) => {
    const trend = computeTrend(series);
    const isUp = trend.delta > 0;
    const isDown = trend.delta < 0;

    const text = trend.isNew
      ? 'New'
      : `${trend.percent > 0 ? '+' : ''}${trend.percent}%`;

    const className = trend.isNew
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : isUp
        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
        : isDown
          ? 'border-rose-200 bg-rose-50 text-rose-700'
          : 'border-slate-200 bg-slate-50 text-slate-600';

    return (
      <span
        className={`inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold ${className}`}
        title={`Today: ${trend.curr} • Yesterday: ${trend.prev}`}
      >
        {text}
      </span>
    );
  };

  const KpiCard = ({
    label,
    value,
    series,
  }: {
    label: string;
    value: number;
    series?: AdminDashboardTimeSeriesPoint[];
  }) => (
    <div className='rounded-2xl border border-slate-200 bg-white p-5'>
      <div className='flex items-start justify-between gap-3'>
        <p className='text-xs font-semibold tracking-[0.22em] whitespace-nowrap text-slate-500 uppercase'>
          {label}
        </p>
        {series ? <TrendBadge series={series} /> : null}
      </div>
      <p className='mt-3 text-3xl font-semibold text-slate-900'>
        {isLoading ? '—' : value}
      </p>
    </div>
  );

  return (
    <div className='mx-auto w-full max-w-7xl px-6 py-10 lg:px-10'>
      <div className='mb-8 flex flex-col gap-2'>
        <p className='text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase'>
          Admin
        </p>
        <AnimatedTitle className='text-3xl font-bold text-slate-900'>
          Dashboard
        </AnimatedTitle>
        <AnimatedSubtitle className='max-w-2xl text-sm text-slate-600'>
          Manage content and keep NutriPlan up to date.
        </AnimatedSubtitle>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        <KpiCard
          label='Users'
          value={stats?.totals.users ?? 0}
          series={timeSeries?.users}
        />
        <KpiCard
          label='Foods'
          value={stats?.totals.foods ?? 0}
          series={timeSeries?.foods}
        />
        <KpiCard
          label='Meal plans'
          value={stats?.totals.mealPlans ?? 0}
          series={timeSeries?.mealPlans}
        />
        <KpiCard
          label='Curated collections'
          value={stats?.totals.collections ?? 0}
          series={timeSeries?.curatedCollections}
        />

        <KpiCard
          label='Curated views'
          value={stats?.totals.curatedCollectionViews ?? 0}
          series={timeSeries?.curatedCollectionViews}
        />
        <KpiCard
          label='Curated copies'
          value={stats?.totals.curatedCollectionCopies ?? 0}
          series={timeSeries?.curatedCollectionCopies}
        />

        <KpiCard
          label='Food views'
          value={stats?.totals.foodViews ?? 0}
          series={timeSeries?.foodViews}
        />
        <KpiCard
          label='Article views'
          value={stats?.totals.articleViews ?? 0}
          series={timeSeries?.articleViews}
        />
      </div>

      <div className='mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3'>
        <TimeSeriesCard
          title='Meal plans created'
          subtitle='Last 14 days'
          data={timeSeries?.mealPlans}
          color='#0ea5e9'
          isLoading={isLoading}
          formatShortDate={formatShortDate}
        />
        <TimeSeriesCard
          title='Favorites added'
          subtitle='Last 14 days'
          data={timeSeries?.favorites}
          color='#f97316'
          isLoading={isLoading}
          formatShortDate={formatShortDate}
        />
        <TimeSeriesCard
          title='Curated views'
          subtitle='Last 14 days'
          data={timeSeries?.curatedCollectionViews}
          color='#8b5cf6'
          isLoading={isLoading}
          formatShortDate={formatShortDate}
        />
        <TimeSeriesCard
          title='Curated copies'
          subtitle='Last 14 days'
          data={timeSeries?.curatedCollectionCopies}
          color='#14b8a6'
          isLoading={isLoading}
          formatShortDate={formatShortDate}
        />
        <TimeSeriesCard
          title='Food views'
          subtitle='Last 14 days'
          data={timeSeries?.foodViews}
          color='#16a34a'
          isLoading={isLoading}
          formatShortDate={formatShortDate}
        />
        <TimeSeriesCard
          title='Article views'
          subtitle='Last 14 days'
          data={timeSeries?.articleViews}
          color='#6366f1'
          isLoading={isLoading}
          formatShortDate={formatShortDate}
        />
      </div>

      <div className='mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]'>
        <div className='grid gap-6 md:grid-cols-2'>
          <div className='rounded-2xl border border-slate-200 bg-white p-5'>
            <p className='text-sm font-semibold text-slate-900'>
              Top viewed foods
            </p>
            <div className='mt-4 space-y-3'>
              {(stats?.topViewedFoods ?? []).slice(0, 10).map((food) => (
                <div key={food.foodId} className='flex items-center gap-3'>
                  <div className='h-10 w-10 overflow-hidden rounded-xl bg-slate-100'>
                    {food.imgUrl ? (
                      <img
                        src={food.imgUrl}
                        alt={food.name}
                        className='h-full w-full object-cover'
                      />
                    ) : null}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-slate-900'>
                      {food.name || 'Unknown'}
                    </p>
                    <p className='text-xs text-slate-500'>{food.count} views</p>
                  </div>
                </div>
              ))}
              {!isLoading && (stats?.topViewedFoods?.length ?? 0) === 0 && (
                <p className='text-sm text-slate-500'>No data yet.</p>
              )}
            </div>
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white p-5'>
            <p className='text-sm font-semibold text-slate-900'>
              Top favorited foods
            </p>
            <div className='mt-4 space-y-3'>
              {(stats?.topFavoritedFoods ?? []).slice(0, 10).map((food) => (
                <div key={food.foodId} className='flex items-center gap-3'>
                  <div className='h-10 w-10 overflow-hidden rounded-xl bg-slate-100'>
                    {food.imgUrl ? (
                      <img
                        src={food.imgUrl}
                        alt={food.name}
                        className='h-full w-full object-cover'
                      />
                    ) : null}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-slate-900'>
                      {food.name || 'Unknown'}
                    </p>
                    <p className='text-xs text-slate-500'>
                      {food.count} favorites
                    </p>
                  </div>
                </div>
              ))}
              {!isLoading && (stats?.topFavoritedFoods?.length ?? 0) === 0 && (
                <p className='text-sm text-slate-500'>No data yet.</p>
              )}
            </div>
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white p-5'>
            <p className='text-sm font-semibold text-slate-900'>
              Top meal plan foods
            </p>
            <div className='mt-4 space-y-3'>
              {(stats?.topMealPlanFoods ?? []).slice(0, 10).map((food) => (
                <div key={food.foodId} className='flex items-center gap-3'>
                  <div className='h-10 w-10 overflow-hidden rounded-xl bg-slate-100'>
                    {food.imgUrl ? (
                      <img
                        src={food.imgUrl}
                        alt={food.name}
                        className='h-full w-full object-cover'
                      />
                    ) : null}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-slate-900'>
                      {food.name || 'Unknown'}
                    </p>
                    <p className='text-xs text-slate-500'>
                      {food.count} selections
                    </p>
                  </div>
                </div>
              ))}
              {!isLoading && (stats?.topMealPlanFoods?.length ?? 0) === 0 && (
                <p className='text-sm text-slate-500'>No data yet.</p>
              )}
            </div>
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white p-5'>
            <p className='text-sm font-semibold text-slate-900'>
              Top exclusion foods
            </p>
            <div className='mt-4 space-y-3'>
              {(stats?.topExcludedFoods ?? []).slice(0, 10).map((food) => (
                <div key={food.foodId} className='flex items-center gap-3'>
                  <div className='h-10 w-10 overflow-hidden rounded-xl bg-slate-100'>
                    {food.imgUrl ? (
                      <img
                        src={food.imgUrl}
                        alt={food.name}
                        className='h-full w-full object-cover'
                      />
                    ) : null}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-slate-900'>
                      {food.name || 'Unknown'}
                    </p>
                    <p className='text-xs text-slate-500'>
                      {food.count} exclusions
                    </p>
                  </div>
                </div>
              ))}
              {!isLoading && (stats?.topExcludedFoods?.length ?? 0) === 0 && (
                <p className='text-sm text-slate-500'>No data yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className='space-y-6'>
          <div className='rounded-2xl border border-slate-200 bg-white p-5'>
            <p className='text-sm font-semibold text-slate-900'>
              Primary diets
            </p>
            {isLoading ? (
              <div className='mt-4 h-48 animate-pulse rounded-2xl bg-slate-100' />
            ) : (stats?.primaryDiets?.length ?? 0) > 0 ? (
              <div className='mt-4 h-56'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={stats?.primaryDiets ?? []}
                    margin={{ top: 10, right: 8, left: -14, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray='4 4' stroke='#e2e8f0' />
                    <XAxis
                      dataKey='diet'
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#64748b' }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                      width={32}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}`, 'Users']}
                    />
                    <Bar dataKey='count' fill='#10b981' radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className='mt-4 text-sm text-slate-500'>No data yet.</p>
            )}
          </div>

          <div className='rounded-2xl border border-slate-200 bg-white p-5'>
            <div className='flex items-start justify-between gap-4'>
              <div className='min-w-0'>
                <p className='text-xs font-semibold tracking-[0.22em] text-slate-500 uppercase'>
                  Content
                </p>
                <h2 className='mt-2 text-base font-semibold text-slate-900'>
                  Article views
                </h2>
                <p className='mt-2 text-sm text-slate-600'>
                  View counts for the most viewed articles.
                </p>
              </div>
              <Link
                to={PATH.ADMIN_ARTICLES as unknown as string}
                className='shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[11px] font-semibold text-slate-700 hover:border-slate-300'
              >
                Manage
              </Link>
            </div>
            <div className='mt-4 space-y-3'>
              {(stats?.topViewedArticles ?? []).slice(0, 10).map((article) => (
                <div
                  key={article.articleId}
                  className='flex items-center gap-3'
                >
                  <div className='h-10 w-10 overflow-hidden rounded-xl bg-slate-100'>
                    {article.coverImageUrl ? (
                      <img
                        src={article.coverImageUrl}
                        alt={article.title}
                        className='h-full w-full object-cover'
                      />
                    ) : null}
                  </div>
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-sm font-semibold text-slate-900'>
                      {article.title || 'Unknown'}
                    </p>
                    <p className='text-xs text-slate-500'>
                      {article.count} views
                    </p>
                  </div>
                </div>
              ))}
              {!isLoading && (stats?.topViewedArticles?.length ?? 0) === 0 && (
                <p className='text-sm text-slate-500'>No data yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type TimeSeriesCardProps = {
  title: string;
  subtitle: string;
  data?: AdminDashboardTimeSeriesPoint[];
  color: string;
  isLoading: boolean;
  formatShortDate: (value: string) => string;
};

function TimeSeriesCard({
  title,
  subtitle,
  data,
  color,
  isLoading,
  formatShortDate,
}: TimeSeriesCardProps) {
  const chartData = data ?? [];
  const hasData = chartData.some((point) => point.value > 0);
  const gradientId = title.replace(/\s+/g, '-').toLowerCase();

  return (
    <div className='rounded-2xl border border-slate-200 bg-white p-5'>
      <div className='flex items-center justify-between'>
        <p className='text-sm font-semibold text-slate-900'>{title}</p>
        <span className='text-xs font-semibold tracking-[0.18em] text-slate-400 uppercase'>
          {subtitle}
        </span>
      </div>
      {isLoading ? (
        <div className='mt-4 h-48 animate-pulse rounded-2xl bg-slate-100' />
      ) : hasData ? (
        <div className='mt-4 h-48'>
          <ResponsiveContainer width='100%' height='100%'>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 8, left: -14, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1='0' y1='0' x2='0' y2='1'>
                  <stop offset='5%' stopColor={color} stopOpacity={0.3} />
                  <stop offset='95%' stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray='4 4' stroke='#e2e8f0' />
              <XAxis
                dataKey='date'
                tickFormatter={formatShortDate}
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
                width={32}
              />
              <Tooltip
                formatter={(value: number) => [`${value}`, title]}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Area
                type='monotone'
                dataKey='value'
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className='mt-4 text-sm text-slate-500'>No activity yet.</p>
      )}
    </div>
  );
}
