import React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/helpers/helpers';

type AnimatedTitleProps = {
  children: React.ReactNode;
  className?: string;
};

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({
  children,
  className,
}) => (
  <motion.h1
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className={cn(className)}
  >
    {children}
  </motion.h1>
);

export default AnimatedTitle;
