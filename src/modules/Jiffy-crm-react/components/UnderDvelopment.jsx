import React from 'react';
import { motion } from 'framer-motion';
import { HardHat } from 'lucide-react';

const UnderDevelopment = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full w-full text-center p-8 bg-gray-50"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 2.5,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      >
        <HardHat className="h-24 w-24 text-yellow-500" />
      </motion.div>
      <motion.h2
        className="mt-8 text-3xl font-bold text-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        Page Under Development
      </motion.h2>
      <motion.p
        className="mt-4 max-w-md text-lg text-gray-600"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Our team is working hard to bring this feature to you. Please check back later!
      </motion.p>
    </motion.div>
  );
};

export default UnderDevelopment;