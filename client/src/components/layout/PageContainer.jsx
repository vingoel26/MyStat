import { motion } from 'framer-motion';
import clsx from 'clsx';

const PageContainer = ({
  children,
  title,
  description,
  actions,
  className,
  fullWidth = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'min-h-screen pb-8',
        !fullWidth && 'px-4 lg:px-6',
        className
      )}
    >
      {/* Page Header */}
      {(title || actions) && (
        <div className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-[#f8fafc] md:text-3xl">
                {title}
              </h1>
            )}
            {description && (
              <p className="mt-1 text-[#94a3b8]">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Page Content */}
      <div className={clsx(!title && !actions && 'pt-6')}>
        {children}
      </div>
    </motion.div>
  );
};

export default PageContainer;
