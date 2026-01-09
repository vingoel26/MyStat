import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 200,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowPositions = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#1a1a25] border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#1a1a25] border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#1a1a25] border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#1a1a25] border-y-transparent border-l-transparent',
  };

  const animations = {
    top: { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 } },
    bottom: { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 } },
    left: { initial: { opacity: 0, x: 10 }, animate: { opacity: 1, x: 0 } },
    right: { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 } },
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <AnimatePresence>
        {isVisible && content && (
          <motion.div
            initial={animations[position].initial}
            animate={animations[position].animate}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={clsx(
              'absolute z-50 px-3 py-1.5 text-sm text-[#f8fafc] bg-[#1a1a25] border border-[#2a2a35] rounded-lg shadow-lg whitespace-nowrap',
              positions[position],
              className
            )}
          >
            {content}
            <div
              className={clsx(
                'absolute w-0 h-0 border-[6px]',
                arrowPositions[position]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
