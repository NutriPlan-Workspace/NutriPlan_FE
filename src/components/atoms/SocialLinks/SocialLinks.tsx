import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';

interface SocialLink {
  icon: React.ReactNode;
  href: string;
}

const socialLinks: SocialLink[] = [
  { icon: <FaLinkedin />, href: '#' },
  { icon: <FaInstagram />, href: '#' },
  { icon: <FaFacebook />, href: '#' },
];

const SocialLinks: React.FC = () => (
  <div className='flex max-w-[296px] flex-col items-start gap-3'>
    <p className='text-[12px] font-semibold tracking-[0.2em] text-slate-400 uppercase'>
      Follow us
    </p>
    <ul className='flex gap-3'>
      {socialLinks.map(({ icon, href }, index) => (
        <li
          key={index}
          className='rounded-full border border-white/10 bg-white/5 p-2 transition hover:border-white/30 hover:bg-white/10'
        >
          <a href={href} className='text-lg text-white'>
            {icon}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default SocialLinks;
