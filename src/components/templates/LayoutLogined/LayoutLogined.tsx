import React, { useState } from 'react';
import { motion } from 'framer-motion';

import { SIDEBAR_WIDTH } from '@/constants/layout';
import { Sidebar } from '@/organisms/Sidebar';

interface LayoutLoginedProps {
  children: (isSidebarOpen: boolean) => React.ReactNode;
}

const LayoutLogined: React.FC<LayoutLoginedProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className='flex min-h-screen'>
      <motion.div
        animate={{
          width: isSidebarOpen ? SIDEBAR_WIDTH.OPEN : SIDEBAR_WIDTH.COLLAPSED,
        }}
        transition={{ duration: 0.12, ease: 'easeInOut' }}
        className='transition-all'
      >
        <Sidebar
          isCollapsed={!isSidebarOpen}
          onClickMenu={() => setSidebarOpen(!isSidebarOpen)}
        />
      </motion.div>

      <motion.div className='h-screen flex-1'>
        <main className='h-full w-full'>{children(isSidebarOpen)}</main>
      </motion.div>
    </div>
  );
};

export default LayoutLogined;
