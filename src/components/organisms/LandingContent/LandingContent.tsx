import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import { Button } from '@/atoms/Button';
import { PATH } from '@/constants/path';
import { Role } from '@/constants/role';
import { MealPlan } from '@/molecules/MealPlan';
import { useGetArticlesQuery } from '@/redux/query/apis/articles/articlesApi';
import { useGetCuratedCollectionsQuery } from '@/redux/query/apis/collection/collectionApi';
import { userSelector } from '@/redux/slices/user';

const sectionContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

const sectionItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const LandingContent: React.FC = () => {
  const user = useSelector(userSelector).user;
  const isAuthenticated = Boolean(user?.id) && user?.role !== Role.GUEST;
  const parallaxRef = useRef<HTMLDivElement | null>(null);
  const freshMealsBlobsRef = useRef<HTMLDivElement | null>(null);

  const slides = [
    {
      title: 'Plan smarter, eat brighter',
      description: 'Personalize your weekly meals in minutes, not hours.',
      image:
        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=2000&q=80',
    },
    {
      title: 'Wide variety\nof dishes',
      description:
        'Track your nutrition while enjoying vibrant meals every day.',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2000&q=80',
    },
    {
      title: 'Fresh, colorful, and balanced',
      description:
        'Curated meals with balanced macros and fresh local flavors.',
      image:
        'https://images.unsplash.com/photo-1546069901-eacef0df6022?auto=format&fit=crop&w=2000&q=80',
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  const {
    data: articlesData,
    isLoading: isArticlesLoading,
    isError: isArticlesError,
  } = useGetArticlesQuery({ limit: 3 });
  const latestArticles = articlesData?.data?.items ?? [];

  const { data: curatedCollectionsData } = useGetCuratedCollectionsQuery(
    {
      page: 1,
      limit: 3,
    },
    {
      skip: !isAuthenticated,
    },
  );

  const curatedCollections = (curatedCollectionsData?.data?.items ?? [])
    .slice()
    .sort((a, b) => {
      const aTime = new Date(a.createdAt ?? a.updatedAt ?? 0).getTime();
      const bTime = new Date(b.createdAt ?? b.updatedAt ?? 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 3);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const backgroundEl = parallaxRef.current;
    const blobsEl = freshMealsBlobsRef.current;
    if (!backgroundEl && !blobsEl) return;

    let rafId = 0;
    const update = () => {
      rafId = 0;
      const y = window.scrollY || 0;

      if (backgroundEl) {
        backgroundEl.style.transform = `translate3d(0, ${Math.round(y * 0.12)}px, 0)`;
      }
      if (blobsEl) {
        blobsEl.style.transform = `translate3d(0, ${Math.round(y * 0.06)}px, 0)`;
      }
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  const freshMealsHref = isAuthenticated ? PATH.BROWSE_FOODS : PATH.LOGIN;

  return (
    <div className='relative flex w-full flex-col gap-16 pb-16'>
      <div
        ref={parallaxRef}
        aria-hidden='true'
        className='pointer-events-none fixed inset-0 -z-10 opacity-100'
        style={{
          backgroundImage:
            'radial-gradient(1100px circle at 18% 16%, rgba(14, 165, 233, 0.28), transparent 60%), radial-gradient(900px circle at 82% 22%, rgba(16, 185, 129, 0.22), transparent 58%), radial-gradient(800px circle at 55% 88%, rgba(59, 130, 246, 0.18), transparent 60%), linear-gradient(180deg, #f8fbff 0%, #f2fbf7 55%, #f8fbff 100%)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          willChange: 'transform',
        }}
      />
      <section className='relative w-full overflow-hidden'>
        <div className='relative h-[520px] w-full md:h-[620px] lg:h-[720px]'>
          {slides.map((slide, index) => (
            <div
              key={slide.title}
              className={`absolute inset-0 transition duration-1000 ${
                index === activeSlide
                  ? 'scale-100 opacity-100'
                  : 'scale-105 opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className='h-full w-full object-cover'
              />
              <div className='absolute inset-0 bg-gradient-to-b from-black/60 via-black/35 to-black/70' />
            </div>
          ))}
        </div>

        <div className='absolute inset-0 flex items-center'>
          <div className='mx-auto w-full max-w-7xl px-6 lg:px-10 xl:px-24'>
            <div className='max-w-2xl text-white'>
              <span className='inline-flex rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold tracking-[0.3em] uppercase'>
                NutriPlan • Healthy food
              </span>
              <h1 className='entry-title mt-5 line-clamp-2 max-w-[520px] text-6xl leading-tight tracking-tight sm:text-8xl lg:max-w-[640px] lg:text-[80px]'>
                {slides[activeSlide].title.split('\n').map((part, idx, arr) => (
                  <React.Fragment key={`${part}-${idx}`}>
                    {part}
                    {idx < arr.length - 1 ? <br /> : null}
                  </React.Fragment>
                ))}
              </h1>
              <p className='mt-4 text-base text-white/80 md:text-lg'>
                {slides[activeSlide].description}
              </p>
              <div className='mt-6 flex flex-wrap items-center gap-3'>
                <a href={PATH.REGISTER}>
                  <Button className='bg-primary hover:bg-primary-400 border-none px-6 py-5 text-[15px] font-bold text-black'>
                    Start free today
                  </Button>
                </a>
                <a
                  href={PATH.BROWSE_FOODS}
                  className='rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white shadow-sm backdrop-blur transition hover:border-white/50 hover:bg-white/15'
                >
                  Browse foods
                </a>
              </div>
              <div className='mt-8 flex items-center gap-2'>
                {slides.map((_, index) => (
                  <button
                    key={index}
                    type='button'
                    aria-label={`Go to slide ${index + 1}`}
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 w-8 rounded-full transition ${
                      index === activeSlide
                        ? 'bg-white'
                        : 'bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        data-tour='landing-fresh-meals'
        className='relative overflow-hidden px-6 lg:px-10 xl:px-24'
      >
        <div
          ref={freshMealsBlobsRef}
          aria-hidden='true'
          className='pointer-events-none absolute inset-0 -z-10'
          style={{ willChange: 'transform' }}
        >
          <div className='absolute -top-20 -right-20 h-64 w-64 rounded-full bg-emerald-200/55 blur-[120px]' />
          <div className='absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-sky-200/55 blur-[120px]' />
        </div>

        <motion.div
          variants={sectionContainer}
          initial='show'
          animate='show'
          className='mx-auto w-full max-w-7xl'
        >
          <motion.div
            variants={sectionItem}
            className='mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'
          >
            <div>
              <p className='text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase'>
                Browse foods
              </p>
              <h2 className='font-display m-0 mt-2 text-3xl font-bold text-gray-900'>
                Fresh meals, vibrant flavors
              </h2>
            </div>
            <a
              href={freshMealsHref}
              className='text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline'
            >
              View full library →
            </a>
          </motion.div>

          <div className='grid gap-5 md:grid-cols-3'>
            {(curatedCollections.length > 0
              ? curatedCollections.map((collection) => ({
                  key: collection._id,
                  title: collection.title,
                  image:
                    collection.img ||
                    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80',
                  href: `/collections/${collection._id}`,
                }))
              : [
                  {
                    key: 'balanced-brunch',
                    title: 'Balanced brunch',
                    image:
                      'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=900&q=80',
                    href: PATH.BROWSE_FOODS,
                  },
                  {
                    key: 'protein-packed',
                    title: 'Protein packed',
                    image:
                      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80',
                    href: PATH.BROWSE_FOODS,
                  },
                  {
                    key: 'light-fresh',
                    title: 'Light & fresh',
                    image:
                      'https://images.unsplash.com/photo-1546069901-eacef0df6022?auto=format&fit=crop&w=900&q=80',
                    href: PATH.BROWSE_FOODS,
                  },
                ]
            ).map((card) => (
              <motion.div
                key={card.key}
                variants={sectionItem}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                className='group overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.35)]'
              >
                <a
                  href={isAuthenticated ? card.href : PATH.LOGIN}
                  className='block h-full w-full'
                >
                  <img
                    src={card.image}
                    alt={card.title}
                    className='h-56 w-full object-cover transition duration-500 group-hover:scale-105'
                  />
                  <div className='p-4'>
                    <p className='m-0 text-sm font-semibold text-gray-900'>
                      {card.title}
                    </p>
                    <p className='m-0 mt-1 text-xs text-gray-500'>
                      Curated by NutriPlan
                    </p>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className='relative overflow-hidden px-6 lg:px-10 xl:px-24'>
        <motion.div
          variants={sectionContainer}
          initial='hidden'
          whileInView='show'
          viewport={{ once: true, amount: 0.22 }}
          className='mx-auto w-full max-w-7xl'
        >
          <motion.div
            variants={sectionItem}
            className='mb-6 flex flex-col gap-2'
          >
            <p className='text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase'>
              Smart nutrition
            </p>
            <h2 className='font-display m-0 text-3xl font-bold text-gray-900'>
              Insights that keep you consistent
            </h2>
          </motion.div>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
            {[
              {
                title: 'Smart meal planning',
                description:
                  'Auto-generate weekly menus based on your calorie targets and dietary preferences.',
              },
              {
                title: 'Nutrition tracking',
                description:
                  'Monitor macros, micros, and calories with clear daily summaries and insights.',
              },
              {
                title: 'Shop with confidence',
                description:
                  'Get grocery lists and ingredient breakdowns to stay on budget and on track.',
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={sectionItem}
                whileHover={{ y: -6 }}
                transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                className='rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.35)]'
              >
                <div className='mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700'>
                  ✦
                </div>
                <h3 className='m-0 text-lg font-semibold text-gray-900'>
                  {item.title}
                </h3>
                <p className='mt-2 text-sm text-gray-600'>{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className='px-6 lg:px-10 xl:px-24'>
        <div className='mx-auto w-full max-w-7xl rounded-[32px] border border-white/70 bg-white/80 p-8 shadow-[0_24px_64px_-40px_rgba(16,24,40,0.35)]'>
          <div className='grid gap-10 lg:grid-cols-[1.1fr_0.9fr]'>
            <div>
              <p className='text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase'>
                How it works
              </p>
              <h2 className='font-display m-0 mt-2 text-3xl font-bold text-gray-900'>
                Build healthy habits without the overwhelm
              </h2>
              <p className='mt-3 max-w-xl text-sm text-gray-600'>
                NutriPlan combines curated foods, AI-assisted planning, and
                nutrition tracking so you can hit your goals with less effort.
              </p>
              <div className='mt-6 space-y-4'>
                {[
                  'Tell us your goals, dietary style, and calorie target.',
                  'Generate a personalized meal plan in seconds.',
                  'Swap meals, track progress, and export grocery lists.',
                ].map((step, index) => (
                  <div key={step} className='flex items-start gap-3'>
                    <div className='mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white'>
                      0{index + 1}
                    </div>
                    <p className='m-0 text-sm text-gray-700'>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className='grid gap-4'>
              {[
                {
                  title: 'Macro balanced',
                  value: '40% carbs · 30% protein · 30% fat',
                },
                {
                  title: 'Plan refresh',
                  value: 'New suggestions every week',
                },
                {
                  title: 'Flexible swap',
                  value: '1-click changes with nutrition updates',
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className='rounded-2xl border border-gray-200/60 bg-white/90 p-4 shadow-[0_12px_32px_-24px_rgba(16,24,40,0.3)]'
                >
                  <p className='m-0 text-sm font-semibold text-gray-900'>
                    {card.title}
                  </p>
                  <p className='m-0 mt-1 text-xs text-gray-600'>{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className='px-6 lg:px-10 xl:px-24'>
        <div className='mx-auto w-full max-w-7xl'>
          <div className='mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between'>
            <div>
              <p className='text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase'>
                Built for your lifestyle
              </p>
              <h2 className='font-display m-0 mt-2 text-3xl font-bold text-gray-900'>
                Designed for busy, health-focused people
              </h2>
            </div>
            <a
              href={PATH.BROWSE_FOODS}
              className='text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline'
            >
              Browse foods →
            </a>
          </div>

          <div className='grid gap-6 md:grid-cols-3'>
            {[
              {
                title: 'Local favorites',
                description:
                  'Vietnamese-inspired recipes with full nutritional transparency.',
              },
              {
                title: 'Budget friendly',
                description:
                  'Flexible plan options to fit daily budgets and shopping habits.',
              },
              {
                title: 'Adaptive scheduling',
                description: 'Plan for 1 day or 1 week and adjust on the fly.',
              },
            ].map((card) => (
              <div
                key={card.title}
                className='rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.35)]'
              >
                <h3 className='m-0 text-lg font-semibold text-gray-900'>
                  {card.title}
                </h3>
                <p className='mt-2 text-sm text-gray-600'>{card.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='px-6 lg:px-10 xl:px-24'>
        <div className='mx-auto w-full max-w-7xl'>
          <div
            data-tour='landing-mealplan'
            className='rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_24px_64px_-36px_rgba(16,24,40,0.3)] sm:p-8'
          >
            <MealPlan />
          </div>
        </div>
      </section>

      <section className='px-6 lg:px-10 xl:px-24'>
        <div className='mx-auto w-full max-w-7xl'>
          <div className='mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
            <div>
              <p className='text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase'>
                Articles
              </p>
              <h2 className='font-display m-0 mt-2 text-3xl font-bold text-gray-900'>
                Latest nutrition reads
              </h2>
              <p className='mt-2 max-w-2xl text-sm text-gray-600'>
                Quick, practical posts curated by admins—designed to help you
                plan smarter and stay consistent.
              </p>
            </div>
            <a
              href={PATH.ARTICLES}
              className='text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline'
            >
              View all articles →
            </a>
          </div>

          {isArticlesError && (
            <div className='rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-700'>
              Unable to load articles right now.
            </div>
          )}

          {isArticlesLoading && (
            <div className='grid gap-5 md:grid-cols-3'>
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className='overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.35)]'
                >
                  <div className='h-44 w-full animate-pulse bg-slate-100' />
                  <div className='p-5'>
                    <div className='h-4 w-2/3 animate-pulse rounded bg-slate-100' />
                    <div className='mt-3 h-3 w-full animate-pulse rounded bg-slate-100' />
                    <div className='mt-2 h-3 w-5/6 animate-pulse rounded bg-slate-100' />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isArticlesLoading && !isArticlesError && (
            <div className='grid gap-5 md:grid-cols-3'>
              {latestArticles.map((article) => (
                <a
                  key={article.id}
                  href={PATH.ARTICLE_DETAIL.replace('$slug', article.slug)}
                  className='group overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_64px_-40px_rgba(16,24,40,0.45)]'
                >
                  {article.coverImageUrl ? (
                    <img
                      src={article.coverImageUrl}
                      alt={article.title}
                      className='h-44 w-full object-cover transition duration-500 group-hover:scale-105'
                      loading='lazy'
                    />
                  ) : (
                    <div className='h-44 w-full bg-gradient-to-br from-emerald-100 via-white to-sky-100' />
                  )}
                  <div className='p-5'>
                    <p className='m-0 line-clamp-2 text-sm font-semibold text-gray-900'>
                      {article.title}
                    </p>
                    {article.excerpt && (
                      <p className='m-0 mt-2 line-clamp-3 text-xs text-gray-600'>
                        {article.excerpt}
                      </p>
                    )}
                    <p className='m-0 mt-4 text-xs font-semibold text-emerald-700'>
                      Read →
                    </p>
                  </div>
                </a>
              ))}

              {latestArticles.length === 0 && (
                <div className='rounded-3xl border border-white/70 bg-white/80 p-6 text-sm text-gray-600 md:col-span-3'>
                  No articles yet.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className='px-6 lg:px-10 xl:px-24'>
        <div className='mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]'>
          <div className='rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.35)]'>
            <p className='text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase'>
              Testimonials
            </p>
            <h3 className='font-display m-0 mt-2 text-2xl font-bold text-gray-900'>
              “It finally made planning feel easy.”
            </h3>
            <p className='mt-3 text-sm text-gray-600'>
              “NutriPlan helped me cut down on takeout and keep my macros
              balanced. The grocery list feature saves me hours every week.”
            </p>
            <div className='mt-5 flex items-center gap-3'>
              <div className='h-10 w-10 rounded-full bg-emerald-100' />
              <div>
                <p className='m-0 text-sm font-semibold text-gray-900'>
                  Trang N.
                </p>
                <p className='m-0 text-xs text-gray-500'>Busy professional</p>
              </div>
            </div>
          </div>

          <div className='flex h-full flex-col justify-between rounded-[28px] border border-emerald-200/70 bg-emerald-600 p-6 text-white shadow-[0_18px_48px_-36px_rgba(16,24,40,0.35)]'>
            <div>
              <p className='text-xs font-semibold tracking-[0.2em] text-emerald-100 uppercase'>
                Ready to begin?
              </p>
              <h3 className='font-display m-0 mt-3 text-3xl font-bold'>
                Start building your plan today.
              </h3>
              <p className='mt-3 text-sm text-emerald-50'>
                Join thousands of users who are already eating healthier with
                NutriPlan.
              </p>
            </div>
            <div className='mt-6 flex flex-wrap gap-3'>
              <a href={PATH.REGISTER}>
                <Button className='border-none bg-white px-6 py-5 text-[15px] font-bold text-emerald-700 hover:bg-emerald-50'>
                  Create free account
                </Button>
              </a>
              <a
                href={PATH.LOGIN}
                className='rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10'
              >
                Log in
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingContent;
