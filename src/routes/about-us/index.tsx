import { SiNodedotjs, SiReact, SiRedux, SiTypescript } from 'react-icons/si';
import { createFileRoute, FileRoutesByPath } from '@tanstack/react-router';
import { motion } from 'framer-motion';

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

function AboutUsPage() {
  return (
    <div className='w-full'>
      {/* Hero Section - Matching How It Works */}
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
                About the Author
              </motion.p>
              <motion.h1
                variants={item}
                className='mt-4 text-4xl font-bold tracking-tight sm:text-5xl'
              >
                Trần Nhật Minh
              </motion.h1>
              <motion.p
                variants={item}
                className='mt-5 max-w-xl text-sm text-white/75 md:text-base'
              >
                Student at University of Science and Technology — Da Nang.
                Passionate about applying AI to solve real-world nutrition
                challenges.
              </motion.p>

              <motion.div variants={item} className='mt-8 flex flex-wrap gap-3'>
                <a
                  href='mailto:nhatminh10b1@gmail.com'
                  className='rounded-full bg-emerald-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400'
                >
                  Contact Me
                </a>
              </motion.div>

              {/* Quick Stats Grid */}
              <motion.div
                variants={item}
                className='mt-10 grid gap-3 sm:grid-cols-2'
              >
                {[
                  { label: 'Role', value: 'Fullstack Developer' },
                  { label: 'Focus', value: 'Product & AI' },
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

            <motion.div
              variants={item}
              className='relative flex justify-center lg:justify-end'
            >
              <div className='relative h-64 w-64 lg:h-80 lg:w-80'>
                <div className='absolute inset-0 animate-pulse rounded-full bg-gradient-to-tr from-emerald-500 to-sky-500 opacity-20 blur-2xl'></div>
                <img
                  src='https://res.cloudinary.com/dtwrwvffl/image/upload/v1769681024/103007451_2628728740718077_5001223664026043688_n_qujaqm.jpg'
                  alt='Trần Nhật Minh'
                  className='relative h-full w-full rounded-full border-4 border-slate-800 object-cover shadow-2xl'
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section 2: Personal Focus - Styled like "The flow" */}
      <section className='bg-white px-6 py-14 text-slate-900 lg:px-10 lg:py-16 xl:px-24'>
        <div className='mx-auto w-full max-w-7xl'>
          <motion.div
            initial='hidden'
            whileInView='show'
            viewport={{ once: true, amount: 0.2 }}
            variants={container}
          >
            <motion.div variants={item} className='max-w-2xl'>
              <p className='text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase'>
                My Approach
              </p>
              <h2 className='font-display m-0 mt-2 text-3xl font-bold text-gray-900'>
                Building with purpose
              </h2>
              <p className='mt-3 text-sm text-gray-600'>
                I believe software should be intuitive, helpful, and grounded in
                real human needs.
              </p>
            </motion.div>

            <div className='mt-8 grid gap-6 lg:grid-cols-3'>
              {[
                {
                  title: 'User Centric',
                  desc: 'Designing features that address actual friction points in meal planning.',
                  icon: 'User',
                },
                {
                  title: 'Data Driven',
                  desc: 'Using strict validation to ensure nutritional advice is accurate and safe.',
                  icon: 'Chart',
                },
                {
                  title: 'Scalable',
                  desc: 'Architecting systems (React/Node) that can grow and adapt easily.',
                  icon: 'Code',
                },
              ].map((card, idx) => (
                <motion.div
                  key={card.title}
                  variants={item}
                  className='rounded-[28px] border border-slate-100 bg-white p-6 shadow-[0_18px_48px_-36px_rgba(16,24,40,0.1)]'
                >
                  <div className='flex items-center justify-between'>
                    <p className='m-0 text-xs font-semibold tracking-[0.28em] text-emerald-700 uppercase'>
                      Focus 0{idx + 1}
                    </p>
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

      {/* Section 3: The Project - Styled like "What you get" */}
      <section className='bg-white px-6 pb-16 lg:px-10 xl:px-24'>
        <div className='mx-auto w-full max-w-7xl rounded-[40px] border border-emerald-100 bg-emerald-50/50 p-8 shadow-[0_30px_70px_-46px_rgba(16,24,40,0.05)] lg:p-10'>
          <div className='grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'>
            <div>
              <p className='text-sm font-semibold tracking-[0.2em] text-emerald-600 uppercase'>
                The Thesis
              </p>
              <h2 className='font-display m-0 mt-2 text-3xl font-bold text-gray-900'>
                NutriPlan System
              </h2>
              <p className='mt-3 text-sm text-gray-600'>
                A comprehensive graduation project demonstrating the power of AI
                in health.
              </p>

              <div className='mt-6 space-y-4'>
                <div className='rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm'>
                  <h4 className='mb-2 font-semibold text-gray-900'>
                    Technology Stack
                  </h4>
                  <div className='flex gap-4 text-2xl text-slate-600'>
                    <SiReact
                      title='React'
                      className='transition hover:text-[#61DAFB]'
                    />
                    <SiTypescript
                      title='TypeScript'
                      className='transition hover:text-[#3178C6]'
                    />
                    <SiNodedotjs
                      title='Node.js'
                      className='transition hover:text-[#339933]'
                    />
                    <SiRedux
                      title='Redux'
                      className='transition hover:text-[#764ABC]'
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className='grid gap-4'>
              {[
                { k: 'AI Powered', v: 'Personalized meal generation via LLM' },
                {
                  k: 'Micronutrients',
                  v: 'Strict tracking of Sodium, Cholesterol, Fiber',
                },
                {
                  k: 'Groceries',
                  v: 'Automatic aggregation & Pantry management',
                },
              ].map((m) => (
                <div
                  key={m.k}
                  className='rounded-2xl border border-white/60 bg-white/80 p-4 shadow-sm'
                >
                  <p className='m-0 text-sm font-semibold text-emerald-800 text-gray-900'>
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

export const Route = createFileRoute(PATH.ABOUT_US as keyof FileRoutesByPath)({
  component: AboutUsPage,
  beforeLoad: handlePublicRoute,
});
