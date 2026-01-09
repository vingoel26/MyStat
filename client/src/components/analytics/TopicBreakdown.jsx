import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { CHART_COLORS } from '../../utils/constants';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1a1a25] border border-[#2a2a35] rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-[#f8fafc]">{data.topic}</p>
        <p className="text-sm text-[#94a3b8]">
          {data.percentage}% mastery ({data.solved}/{data.total})
        </p>
      </div>
    );
  }
  return null;
};

const TopicBreakdown = ({
  topics, // Array of { topic: string, solved: number, total: number, percentage: number }
  title = 'Topic Performance',
  className,
}) => {
  // Take top 8 topics for the radar chart
  const chartTopics = topics.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-5">
        <h3 className="text-lg font-semibold text-[#f8fafc] mb-4">{title}</h3>
        
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={chartTopics}>
            <PolarGrid stroke="#2a2a35" />
            <PolarAngleAxis
              dataKey="topic"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(value) => value.length > 12 ? value.substring(0, 12) + '...' : value}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="Performance"
              dataKey="percentage"
              stroke={CHART_COLORS.primary}
              fill={CHART_COLORS.primary}
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-[#2a2a35]">
          <div className="grid grid-cols-2 gap-2">
            {chartTopics.map((topic) => (
              <div key={topic.topic} className="flex items-center justify-between text-sm">
                <span className="text-[#94a3b8] truncate">{topic.topic}</span>
                <span className="text-[#f8fafc] font-medium ml-2">{topic.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TopicBreakdown;
