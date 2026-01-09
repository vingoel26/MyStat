import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import clsx from 'clsx';

const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  type = 'text',
  size = 'md',
  className,
  inputClassName,
  disabled = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5',
  };

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-[#f8fafc] mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748b]">
            <span className={iconSizes[size]}>{leftIcon}</span>
          </div>
        )}
        <input
          ref={ref}
          type={isPassword && showPassword ? 'text' : type}
          disabled={disabled}
          className={clsx(
            'w-full bg-[#12121a] border rounded-lg text-[#f8fafc] placeholder-[#64748b]',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#6366f1] focus:border-transparent',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error
              ? 'border-[#ef4444] focus:ring-[#ef4444]'
              : 'border-[#2a2a35] hover:border-[#6366f1]/50',
            sizes[size],
            leftIcon && 'pl-10',
            (rightIcon || isPassword) && 'pr-10',
            inputClassName
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#94a3b8] transition-colors"
          >
            {showPassword ? (
              <EyeOff className={iconSizes[size]} />
            ) : (
              <Eye className={iconSizes[size]} />
            )}
          </button>
        )}
        {rightIcon && !isPassword && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b]">
            <span className={iconSizes[size]}>{rightIcon}</span>
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={clsx(
          'mt-1.5 text-sm',
          error ? 'text-[#ef4444]' : 'text-[#64748b]'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
