import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';
import { motion } from 'framer-motion';

import { Button } from '@/atoms/Button';
import { PATH } from '@/constants/path';
import { handlePublicRoute } from '@/utils/route';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

function HowItWorksPage() {
  return (
    <div className='w-full'>
      <section className='relative overflow-hidden bg-slate-950 text-white'>
        <div className='pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/25 blur-[120px]' />
        <div className='pointer-events-none absolute -right-20 -bottom-28 h-72 w-72 rounded-full bg-sky-400/25 blur-[120px]' />
        <div className='mx-auto w-full max-w-7xl px-6 py-16 lg:px-10 lg:py-20 xl:px-24'>
          <motion.div
            variants={container}
            initial='hidden'
            animate='show'
            className='grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center'
          >
            <div>
              <motion.p
                variants={item}
                className='text-xs font-semibold tracking-[0.28em] text-emerald-200 uppercase'
              >
                How it works
              </motion.p>
              <motion.h1
                variants={item}
                className='mt-4 text-4xl font-bold tracking-tight sm:text-5xl'
              >
                Plan meals that fit your goals — without the overwhelm
              </motion.h1>
              <motion.p
                variants={item}
                className='mt-5 max-w-xl text-sm text-white/75 md:text-base'
              >
                NutriPlan turns nutrition targets into a real meal plan: select
                your style, generate meals instantly, then swap and track with
                clear nutrition updates.
              </motion.p>

              <motion.div variants={item} className='mt-8 flex flex-wrap gap-3'>
                <a href={PATH.REGISTER}>
                  <Button className='bg-primary hover:bg-primary-400 border-none px-6 py-5 text-[15px] font-bold text-black'>
                    Start free
                  </Button>
                </a>
                <a
                  href={PATH.BROWSE_FOODS}
                  className='rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur transition hover:border-white/40 hover:bg-white/15'
                >
                  Browse foods
                </a>
              </motion.div>

              <motion.div
                variants={item}
                className='mt-10 grid gap-3 sm:grid-cols-3'
              >
                {[
                  { label: 'Personalized', value: 'Targets + preferences' },
                  { label: 'Flexible', value: 'Swap meals anytime' },
                  { label: 'Actionable', value: 'Grocery-ready plan' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className='rounded-2xl border border-white/10 bg-white/5 p-4'
                  >
                    <p className='m-0 text-xs font-semibold text-white/70'>
                      {stat.label}
                    </p>
                    <p className='m-0 mt-1 text-sm font-semibold'>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div variants={item} className='relative'>
              <div className='overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-2'>
                <img
                  src='https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1600&q=80'
                  alt='Meal planning'
                  className='h-[380px] w-full rounded-[26px] object-cover sm:h-[440px]'
                  loading='lazy'
                />
              </div>
              <div className='pointer-events-none absolute -bottom-6 -left-6 rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur'>
                <p className='m-0 text-xs font-semibold tracking-[0.2em] text-emerald-200 uppercase'>
                  Macro snapshot
                </p>
                <p className='m-0 mt-2 text-sm text-white/80'>
                  Balanced calories • Clear targets • Easy swaps
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className='px-6 py-14 lg:px-10 lg:py-16 xl:px-24'>
        <div className='mx-auto w-full max-w-7xl'>
          <motion.div
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.2 }}
            variants={container}
          >
            <motion.div variants={item} className='max-w-2xl'>
              <p className='text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase'>
                The flow
              </p>
              <h2 className='font-display m-0 mt-2 text-3xl font-bold text-gray-900'>
                A simple system you can repeat weekly
              </h2>
              <p className='mt-3 text-sm text-gray-600'>
                Everything is designed to reduce decision fatigue: fewer
                choices, clearer targets, faster execution.
              </p>
            </motion.div>

            <div className='mt-8 grid gap-6 lg:grid-cols-3'>
              {[
                {
                  step: '01',
                  title: 'Set your targets',
                  desc: 'Calories, macro direction, and preferences. No complicated setup.',
                },
                {
                  step: '02',
                  title: 'Generate a plan',
                  desc: 'Get a complete day of meals with nutrition breakdowns in seconds.',
                },
                {
                  step: '03',
                  title: 'Swap & stay consistent',
                  desc: 'Swap meals without breaking targets, then track progress over time.',
                },
              ].map((card) => (
                <motion.div
                  key={card.step}
                  variants={item}
                  className='rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.35)]'
                >
                  <div className='flex items-center justify-between'>
                    <p className='m-0 text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase'>
                      Step {card.step}
                    </p>
                    <span className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-emerald-700'>
                      ✦
                    </span>
                  </div>
                  <h3 className='m-0 mt-4 text-lg font-semibold text-gray-900'>
                    {card.title}
                  </h3>
                  <p className='mt-2 text-sm text-gray-600'>{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className='px-6 pb-16 lg:px-10 xl:px-24'>
        <div className='mx-auto w-full max-w-7xl rounded-[40px] border border-white/70 bg-white/85 p-8 shadow-[0_30px_70px_-46px_rgba(16,24,40,0.4)] lg:p-10'>
          <div className='grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'>
            <div>
              <p className='text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase'>
                What you get
              </p>
              <h2 className='font-display m-0 mt-2 text-3xl font-bold text-gray-900'>
                Built for real-life consistency
              </h2>
              <p className='mt-3 text-sm text-gray-600'>
                Meal planning works when it’s flexible. NutriPlan keeps your
                plan practical so you can stick with it.
              </p>
              <div className='mt-6 space-y-3 text-sm text-gray-700'>
                {[
                  'Clear daily nutrition summaries (calories, macro split).',
                  'Food swaps that auto-update nutrition totals.',
                  'Grocery-ready planning to reduce friction.',
                  'Saved plans you can reuse and iterate on.',
                ].map((row) => (
                  <div key={row} className='flex items-start gap-3'>
                    <span className='mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white'>
                      ✓
                    </span>
                    <span>{row}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='grid gap-4'>
              {[
                { k: 'Plan time', v: '~10 minutes to start' },
                { k: 'Consistency', v: 'repeat weekly, tweak daily' },
                { k: 'Flexibility', v: 'swap meals anytime' },
              ].map((m) => (
                <div
                  key={m.k}
                  className='rounded-2xl border border-gray-200/60 bg-white/90 p-4 shadow-[0_12px_32px_-24px_rgba(16,24,40,0.3)]'
                >
                  <p className='m-0 text-sm font-semibold text-gray-900'>
                    {m.k}
                  </p>
                  <p className='m-0 mt-1 text-xs text-gray-600'>{m.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export const Route = createFileRoute(
  PATH.HOW_IT_WORKS as keyof FileRoutesByPath,
)({
  component: HowItWorksPage,
  beforeLoad: handlePublicRoute,
});
