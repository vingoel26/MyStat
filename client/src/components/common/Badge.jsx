import clsx from 'clsx';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-[#1a1a25] text-[#94a3b8] border border-[#2a2a35]',
    primary: 'bg-[#6366f1]/20 text-[#818cf8] border border-[#6366f1]/30',
    success: 'bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/30',
    warning: 'bg-[#f59e0b]/20 text-[#fbbf24] border border-[#f59e0b]/30',
    danger: 'bg-[#ef4444]/20 text-[#f87171] border border-[#ef4444]/30',
    info: 'bg-[#0ea5e9]/20 text-[#38bdf8] border border-[#0ea5e9]/30',
    // Platform-specific badges
    codeforces: 'bg-[#1890ff]/20 text-[#1890ff] border border-[#1890ff]/30',
    leetcode: 'bg-[#ffa116]/20 text-[#ffa116] border border-[#ffa116]/30',
    codechef: 'bg-[#5b4638]/20 text-[#a08070] border border-[#5b4638]/30',
    atcoder: 'bg-[#222222]/40 text-[#aaaaaa] border border-[#444444]/30',
    github: 'bg-[#24292f]/40 text-[#aaaaaa] border border-[#444444]/30',
    gitlab: 'bg-[#fc6d26]/20 text-[#fc6d26] border border-[#fc6d26]/30',
    kaggle: 'bg-[#20beff]/20 text-[#20beff] border border-[#20beff]/30',
    stackoverflow: 'bg-[#f48024]/20 text-[#f48024] border border-[#f48024]/30',
    kattis: 'bg-[#00a651]/20 text-[#00a651] border border-[#00a651]/30',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  return (
    <span
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {dot && (
        <span className={clsx(
          'w-1.5 h-1.5 rounded-full mr-1.5',
          variant === 'success' && 'bg-[#22c55e]',
          variant === 'warning' && 'bg-[#f59e0b]',
          variant === 'danger' && 'bg-[#ef4444]',
          variant === 'primary' && 'bg-[#6366f1]',
          variant === 'default' && 'bg-[#94a3b8]',
        )} />
      )}
      {children}
    </span>
  );
};

export default Badge;
