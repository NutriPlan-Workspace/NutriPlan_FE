import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

import { SIDEBAR_WIDTH } from '@/constants/layout';
import { Sidebar } from '@/organisms/Sidebar';

interface LayoutLoggedInProps {
  children: ReactNode;
}

const LayoutLoggedIn: React.FC<LayoutLoggedInProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  return (
    <div className='flex h-screen w-screen overflow-hidden'>
      {/* Sidebar */}
      <motion.div
        animate={{
          width: isSidebarOpen ? SIDEBAR_WIDTH.OPEN : SIDEBAR_WIDTH.COLLAPSED,
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className='h-full shrink-0'
      >
        <Sidebar
          isCollapsed={!isSidebarOpen}
          onClickMenu={() => setIsSidebarOpen((prev) => !prev)}
        />
      </motion.div>

      {/* Main Content */}
      <div className='h-full flex-1 overflow-auto'>
        <main className='h-full w-full'>{children}</main>
      </div>
    </div>
  );
};

export default LayoutLoggedIn;
