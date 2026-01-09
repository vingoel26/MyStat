import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CHART_COLORS } from '../../utils/constants';
import { formatNumber } from '../../utils/formatters';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a25] border border-[#2a2a35] rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-[#f8fafc]">{label}</p>
        <p className="text-sm text-[#94a3b8]">
          {formatNumber(payload[0].value)} problems solved
        </p>
      </div>
    );
  }
  return null;
};

const ActivityGraph = ({
  data, // Array of { month: string, count: number }
  title = 'Problems Solved Over Time',
  height = 250,
  className,
}) => {
  // Calculate total and average
  const stats = useMemo(() => {
    const total = data.reduce((sum, d) => sum + d.count, 0);
    const avg = data.length > 0 ? total / data.length : 0;
    const max = Math.max(...data.map(d => d.count));
    return { total, avg, max };
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[#f8fafc]">{title}</h3>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-[#64748b]">Total: </span>
              <span className="font-medium text-[#f8fafc]">{formatNumber(stats.total)}</span>
            </div>
            <div>
              <span className="text-[#64748b]">Avg/month: </span>
              <span className="font-medium text-[#f8fafc]">{Math.round(stats.avg)}</span>
            </div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorProblems" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.3} />
                <stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
            <XAxis
              dataKey="month"
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#2a2a35' }}
              tickFormatter={(value) => {
                // Shorten month names
                const [month] = value.split(' ');
                return month.substring(0, 3);
              }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#2a2a35' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="count"
              stroke={CHART_COLORS.primary}
              strokeWidth={2}
              fill="url(#colorProblems)"
              dot={{ fill: CHART_COLORS.primary, strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5, strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ActivityGraph;
