import { useMemo } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Tooltip from '../common/Tooltip';

const Heatmap = ({
  data, // Array of { date: string, problemsSolved: number }
  title = 'Submission Activity',
  className,
}) => {
  // Generate last 365 days of data
  const calendarData = useMemo(() => {
    const today = new Date();
    const weeks = [];
    let currentDate = new Date(today);
    
    // Go back to the start of the earliest week
    const daysToGoBack = 364 + currentDate.getDay();
    currentDate.setDate(currentDate.getDate() - daysToGoBack);

    // Create data map for quick lookup
    const dataMap = new Map(data.map(d => [d.date, d.problemsSolved]));

    // Generate weeks
    let currentWeek = [];
    for (let i = 0; i <= daysToGoBack; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = dataMap.get(dateStr) || 0;
      
      currentWeek.push({
        date: dateStr,
        count,
        dayOfWeek: currentDate.getDay(),
      });

      if (currentDate.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    return weeks;
  }, [data]);

  // Get color intensity based on count
  const getColor = (count) => {
    if (count === 0) return 'bg-[#1a1a25]';
    if (count <= 2) return 'bg-[#0e4429]';
    if (count <= 4) return 'bg-[#006d32]';
    if (count <= 6) return 'bg-[#26a641]';
    return 'bg-[#39d353]';
  };

  // Calculate stats
  const stats = useMemo(() => {
    const totalDays = data.filter(d => d.problemsSolved > 0).length;
    const totalProblems = data.reduce((sum, d) => sum + d.problemsSolved, 0);
    const maxDay = data.reduce((max, d) => d.problemsSolved > max ? d.problemsSolved : max, 0);
    return { totalDays, totalProblems, maxDay };
  }, [data]);

  // Get month labels
  const monthLabels = useMemo(() => {
    const labels = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    calendarData.forEach((week, index) => {
      if (index > 0 && week[0]) {
        const date = new Date(week[0].date);
        const prevDate = calendarData[index - 1][0] ? new Date(calendarData[index - 1][0].date) : null;
        
        if (!prevDate || date.getMonth() !== prevDate.getMonth()) {
          labels.push({ index, label: months[date.getMonth()] });
        }
      }
    });
    
    return labels;
  }, [calendarData]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

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
            <span className="text-[#64748b]">
              {stats.totalProblems} problems in {stats.totalDays} days
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[750px]">
            {/* Month labels */}
            <div className="flex ml-8 mb-1">
              {monthLabels.map(({ index, label }) => (
                <div
                  key={`${label}-${index}`}
                  className="text-xs text-[#64748b]"
                  style={{ marginLeft: index === 0 ? 0 : `${(index - (monthLabels[monthLabels.indexOf({ index, label }) - 1]?.index || 0)) * 14}px` }}
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="flex">
              {/* Day labels */}
              <div className="flex flex-col gap-[3px] mr-2">
                {dayLabels.map((day, i) => (
                  <div
                    key={day}
                    className="h-[12px] text-[10px] text-[#64748b] flex items-center"
                    style={{ visibility: i % 2 === 1 ? 'visible' : 'hidden' }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="flex gap-[3px]">
                {calendarData.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-[3px]">
                    {week.map((day, dayIndex) => (
                      <Tooltip
                        key={`${weekIndex}-${dayIndex}`}
                        content={`${day.count} problems on ${new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
                        position="top"
                      >
                        <div
                          className={clsx(
                            'w-[12px] h-[12px] rounded-sm transition-all duration-200 cursor-pointer',
                            'hover:ring-1 hover:ring-[#6366f1] hover:ring-offset-1 hover:ring-offset-[#0a0a0f]',
                            getColor(day.count)
                          )}
                        />
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-2 mt-4 ml-8">
              <span className="text-xs text-[#64748b]">Less</span>
              {[0, 2, 4, 6, 8].map((level) => (
                <div
                  key={level}
                  className={clsx('w-[12px] h-[12px] rounded-sm', getColor(level))}
                />
              ))}
              <span className="text-xs text-[#64748b]">More</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Heatmap;
