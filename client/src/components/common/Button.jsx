import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-[#6366f1] hover:bg-[#818cf8] text-white focus:ring-[#6366f1] shadow-lg shadow-[#6366f1]/25 hover:shadow-[#6366f1]/40',
    secondary: 'bg-[#1a1a25] hover:bg-[#2a2a35] text-white border border-[#2a2a35] focus:ring-[#6366f1]',
    ghost: 'bg-transparent hover:bg-[#1a1a25] text-[#94a3b8] hover:text-white focus:ring-[#6366f1]',
    danger: 'bg-[#ef4444] hover:bg-[#dc2626] text-white focus:ring-[#ef4444] shadow-lg shadow-[#ef4444]/25',
    success: 'bg-[#22c55e] hover:bg-[#16a34a] text-white focus:ring-[#22c55e] shadow-lg shadow-[#22c55e]/25',
    outline: 'bg-transparent border-2 border-[#6366f1] text-[#6366f1] hover:bg-[#6366f1] hover:text-white focus:ring-[#6366f1]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    xl: 'px-8 py-4 text-lg gap-3',
    icon: 'p-2',
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      disabled={disabled || isLoading}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;
