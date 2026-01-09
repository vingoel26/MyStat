import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { PLATFORMS, CHART_COLORS } from '../../utils/constants';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1a1a25] border border-[#2a2a35] rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-[#f8fafc] mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[#94a3b8]">{entry.name}:</span>
            <span className="font-medium text-[#f8fafc]">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const RatingGraph = ({
  ratingHistory,
  platforms = ['codeforces', 'leetcode'],
  title = 'Rating Progression',
  height = 300,
  className,
}) => {
  // Combine rating history from multiple platforms into unified data
  const chartData = useMemo(() => {
    const allDates = new Set();
    
    // Collect all dates
    platforms.forEach(platform => {
      const history = ratingHistory[platform] || [];
      history.forEach(entry => allDates.add(entry.date));
    });

    // Sort dates
    const sortedDates = Array.from(allDates).sort();

    // Create data points for each date
    return sortedDates.map(date => {
      const dataPoint = { date: new Date(date).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }) };
      
      platforms.forEach(platform => {
        const history = ratingHistory[platform] || [];
        const entry = history.find(e => e.date === date);
        if (entry) {
          dataPoint[platform] = entry.rating;
        }
      });

      return dataPoint;
    });
  }, [ratingHistory, platforms]);

  const platformColors = {
    codeforces: PLATFORMS.codeforces.color,
    leetcode: PLATFORMS.leetcode.color,
    codechef: PLATFORMS.codechef.color,
    atcoder: '#6366f1',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-5">
        <h3 className="text-lg font-semibold text-[#f8fafc] mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              {platforms.map(platform => (
                <linearGradient key={platform} id={`gradient-${platform}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={platformColors[platform] || CHART_COLORS.primary} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={platformColors[platform] || CHART_COLORS.primary} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#2a2a35' }}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#64748b', fontSize: 12 }}
              axisLine={{ stroke: '#2a2a35' }}
              domain={['dataMin - 100', 'dataMax + 100']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => (
                <span className="text-sm text-[#94a3b8] capitalize">{value}</span>
              )}
            />
            {platforms.map(platform => (
              <Line
                key={platform}
                type="monotone"
                dataKey={platform}
                name={PLATFORMS[platform]?.name || platform}
                stroke={platformColors[platform] || CHART_COLORS.primary}
                strokeWidth={2}
                dot={{ fill: platformColors[platform] || CHART_COLORS.primary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default RatingGraph;
