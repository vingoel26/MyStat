import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({
  children,
  className,
  variant = 'default',
  hover = true,
  glow = false,
  padding = 'md',
  onClick,
  ...props
}) => {
  const baseStyles = 'rounded-xl border transition-all duration-300';

  const variants = {
    default: 'bg-[#12121a] border-[#2a2a35]',
    glass: 'bg-[#12121a]/80 backdrop-blur-xl border-white/10',
    gradient: 'bg-gradient-to-br from-[#12121a] to-[#1a1a25] border-[#2a2a35]',
    elevated: 'bg-[#12121a] border-[#2a2a35] shadow-xl shadow-black/20',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
    xl: 'p-8',
  };

  const hoverStyles = hover
    ? 'hover:border-[#6366f1]/50 hover:shadow-lg hover:shadow-[#6366f1]/5'
    : '';

  const glowStyles = glow
    ? 'shadow-lg shadow-[#6366f1]/20 border-[#6366f1]/30'
    : '';

  const clickableStyles = onClick
    ? 'cursor-pointer'
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -4 } : {}}
      onClick={onClick}
      className={clsx(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverStyles,
        glowStyles,
        clickableStyles,
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Card Header component
const CardHeader = ({ children, className, ...props }) => (
  <div className={clsx('mb-4', className)} {...props}>
    {children}
  </div>
);

// Card Title component
const CardTitle = ({ children, className, ...props }) => (
  <h3 className={clsx('text-lg font-semibold text-[#f8fafc]', className)} {...props}>
    {children}
  </h3>
);

// Card Description component
const CardDescription = ({ children, className, ...props }) => (
  <p className={clsx('text-sm text-[#94a3b8] mt-1', className)} {...props}>
    {children}
  </p>
);

// Card Content component
const CardContent = ({ children, className, ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

// Card Footer component
const CardFooter = ({ children, className, ...props }) => (
  <div className={clsx('mt-4 pt-4 border-t border-[#2a2a35]', className)} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;
