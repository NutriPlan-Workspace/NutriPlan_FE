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
  <div className='flex max-w-[296px] flex-1/4 flex-col items-center'>
    <p className='text-[14px] leading-[150%] font-medium tracking-[-0.14px] text-[#d1d1d6]'>
      Follow us
    </p>
    <ul className='mt-2 flex gap-3'>
      {socialLinks.map(({ icon, href }, index) => (
        <li key={index} className='rounded-full border border-[#f5f5f5] p-2'>
          <a href={href} className='text-lg text-white'>
            {icon}
          </a>
        </li>
      ))}
    </ul>
  </div>
);

export default SocialLinks;
