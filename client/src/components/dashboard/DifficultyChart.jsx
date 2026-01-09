import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DIFFICULTIES } from '../../utils/constants';
import { formatNumber, formatPercentage } from '../../utils/formatters';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#1a1a25] border border-[#2a2a35] rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-[#f8fafc]">{data.name}</p>
        <p className="text-sm text-[#94a3b8]">
          {formatNumber(data.value)} problems ({formatPercentage(data.percentage)})
        </p>
      </div>
    );
  }
  return null;
};

const DifficultyChart = ({
  data, // { easy: number, medium: number, hard: number }
  title = 'Difficulty Distribution',
  className,
}) => {
  const total = data.easy + data.medium + data.hard;
  
  const chartData = [
    {
      name: 'Easy',
      value: data.easy,
      color: DIFFICULTIES.easy.color,
      percentage: total > 0 ? (data.easy / total) * 100 : 0,
    },
    {
      name: 'Medium',
      value: data.medium,
      color: DIFFICULTIES.medium.color,
      percentage: total > 0 ? (data.medium / total) * 100 : 0,
    },
    {
      name: 'Hard',
      value: data.hard,
      color: DIFFICULTIES.hard.color,
      percentage: total > 0 ? (data.hard / total) * 100 : 0,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <div className="bg-[#12121a] border border-[#2a2a35] rounded-xl p-5">
        <h3 className="text-lg font-semibold text-[#f8fafc] mb-4">{title}</h3>
        
        <div className="flex items-center justify-between">
          {/* Chart */}
          <div className="relative w-48 h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-[#f8fafc]">{formatNumber(total)}</span>
              <span className="text-xs text-[#64748b]">Total</span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-4">
            {chartData.map((item) => (
              <div key={item.name} className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <p className="text-sm font-medium text-[#f8fafc]">{item.name}</p>
                  <p className="text-xs text-[#64748b]">
                    {formatNumber(item.value)} ({formatPercentage(item.percentage)})
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DifficultyChart;
