import React from 'react';

interface MarketingSection {
  title: string;
  description: string;
  items?: string[];
}

interface MarketingPageProps {
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  highlights: string[];
  sections: MarketingSection[];
}

const MarketingPage: React.FC<MarketingPageProps> = ({
  eyebrow,
  title,
  description,
  heroImage,
  highlights,
  sections,
}) => (
  <div className='min-h-screen bg-slate-50'>
    <section className='relative overflow-hidden bg-white'>
      <div className='absolute top-12 -left-24 h-72 w-72 rounded-full bg-emerald-100/60 blur-[120px]' />
      <div className='absolute -top-16 -right-24 h-72 w-72 rounded-full bg-sky-100/60 blur-[120px]' />
      <div className='mx-auto w-full max-w-7xl px-6 py-14 lg:px-10 xl:px-24'>
        <div className='grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]'>
          <div>
            <span className='text-xs font-semibold tracking-[0.3em] text-emerald-600 uppercase'>
              {eyebrow}
            </span>
            <h1 className='entry-title mt-4 text-4xl font-semibold text-gray-900 md:text-5xl'>
              {title}
            </h1>
            <p className='mt-4 max-w-xl text-base text-gray-600'>
              {description}
            </p>
            <div className='mt-6 flex flex-wrap gap-3'>
              {highlights.map((highlight) => (
                <span
                  key={highlight}
                  className='rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600'
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>
          <div className='relative overflow-hidden rounded-[28px] border border-white/60 bg-white shadow-[0_24px_60px_-36px_rgba(16,24,40,0.35)]'>
            <img
              src={heroImage}
              alt={title}
              className='h-72 w-full object-cover md:h-80'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
          </div>
        </div>
      </div>
    </section>

    <section className='mx-auto w-full max-w-7xl px-6 py-12 lg:px-10 xl:px-24'>
      <div className='grid gap-6 md:grid-cols-2'>
        {sections.map((section) => (
          <div
            key={section.title}
            className='rounded-[24px] border border-white/70 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(16,24,40,0.2)]'
          >
            <h2 className='text-2xl font-semibold text-gray-900'>
              {section.title}
            </h2>
            <p className='mt-2 text-sm text-gray-600'>{section.description}</p>
            {section.items && (
              <ul className='mt-4 space-y-2 text-sm text-gray-700'>
                {section.items.map((item) => (
                  <li key={item} className='flex items-start gap-2'>
                    <span className='mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white'>
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </section>
  </div>
);

export default MarketingPage;
