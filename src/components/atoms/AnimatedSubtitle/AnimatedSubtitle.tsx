import React from 'react';
import { motion } from 'framer-motion';

import { cn } from '@/helpers/helpers';

type AnimatedSubtitleProps = {
  children: React.ReactNode;
  className?: string;
};

const AnimatedSubtitle: React.FC<AnimatedSubtitleProps> = ({
  children,
  className,
}) => (
  <motion.p
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    className={cn(className)}
  >
    {children}
  </motion.p>
);

export default AnimatedSubtitle;
