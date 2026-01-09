import clsx from 'clsx';
import { getInitials } from '../../utils/formatters';

const Avatar = ({
  src,
  alt,
  name,
  size = 'md',
  className,
  status,
  ...props
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-xl',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const statusColors = {
    online: 'bg-[#22c55e]',
    offline: 'bg-[#64748b]',
    busy: 'bg-[#ef4444]',
    away: 'bg-[#f59e0b]',
  };

  const initials = getInitials(name || alt);

  return (
    <div className={clsx('relative inline-flex', className)} {...props}>
      {src ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={clsx(
            'rounded-full object-cover bg-[#1a1a25] border-2 border-[#2a2a35]',
            sizes[size]
          )}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full flex items-center justify-center font-semibold',
            'bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white',
            sizes[size]
          )}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-2 border-[#0a0a0f]',
            statusSizes[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
