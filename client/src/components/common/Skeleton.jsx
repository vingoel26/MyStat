import clsx from 'clsx';

const Skeleton = ({
  variant = 'text',
  width,
  height,
  className,
  animate = true,
  ...props
}) => {
  const variants = {
    text: 'h-4 rounded',
    title: 'h-6 rounded',
    avatar: 'rounded-full',
    card: 'rounded-xl',
    button: 'h-10 rounded-lg',
    circle: 'rounded-full',
  };

  const baseStyles = 'bg-[#1a1a25]';
  const animationStyles = animate
    ? 'animate-pulse bg-gradient-to-r from-[#1a1a25] via-[#2a2a35] to-[#1a1a25] bg-[length:200%_100%]'
    : '';

  const style = {
    width: width,
    height: height,
  };

  return (
    <div
      className={clsx(baseStyles, animationStyles, variants[variant], className)}
      style={style}
      {...props}
    />
  );
};

// Skeleton Card
const SkeletonCard = ({ className }) => (
  <div className={clsx('bg-[#12121a] border border-[#2a2a35] rounded-xl p-5', className)}>
    <div className="flex items-center gap-4 mb-4">
      <Skeleton variant="avatar" width={48} height={48} />
      <div className="flex-1">
        <Skeleton variant="title" width="60%" className="mb-2" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <Skeleton variant="text" className="mb-2" />
    <Skeleton variant="text" width="80%" className="mb-2" />
    <Skeleton variant="text" width="60%" />
  </div>
);

// Skeleton Stats Card
const SkeletonStats = ({ className }) => (
  <div className={clsx('bg-[#12121a] border border-[#2a2a35] rounded-xl p-5', className)}>
    <div className="flex items-center justify-between mb-4">
      <Skeleton variant="circle" width={40} height={40} />
      <Skeleton variant="text" width={60} />
    </div>
    <Skeleton variant="title" width="50%" className="mb-2" />
    <Skeleton variant="text" width="70%" />
  </div>
);

// Skeleton Table Row
const SkeletonTableRow = ({ columns = 5, className }) => (
  <div className={clsx('flex items-center gap-4 py-4 border-b border-[#2a2a35]', className)}>
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={i === 0 ? '30%' : '15%'}
        className="flex-shrink-0"
      />
    ))}
  </div>
);

// Skeleton Chart
const SkeletonChart = ({ className }) => (
  <div className={clsx('bg-[#12121a] border border-[#2a2a35] rounded-xl p-5', className)}>
    <Skeleton variant="title" width="40%" className="mb-4" />
    <div className="flex items-end gap-2 h-48">
      {Array.from({ length: 12 }).map((_, i) => (
        <Skeleton
          key={i}
          className="flex-1 rounded-t"
          height={`${Math.random() * 60 + 40}%`}
        />
      ))}
    </div>
  </div>
);

Skeleton.Card = SkeletonCard;
Skeleton.Stats = SkeletonStats;
Skeleton.TableRow = SkeletonTableRow;
Skeleton.Chart = SkeletonChart;

export default Skeleton;
