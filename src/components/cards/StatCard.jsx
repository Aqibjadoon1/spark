import { memo } from 'react';
import { formatNumber } from '../../utils/formatUtils';

const StatCard = memo(({ icon, label, value = 0, change, color = 'bg-lime' }) => {
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div className="bg-[#F3F3F3] dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-[45px] p-5 shadow-[4px_4px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_#000] transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-[#191A23] dark:text-white">{formatNumber(value)}</p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-sm text-gray-500 dark:text-text-muted">{label}</p>
        {change !== undefined && change !== null && (
          <span
            className={`flex items-center gap-0.5 text-xs font-medium ${
              isPositive ? 'text-green-400' : isNegative ? 'text-red' : 'text-gray-500 dark:text-text-muted'
            }`}
          >
            {isPositive ? (
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path d="M6 2.5L10 7.5H2L6 2.5Z" fill="currentColor" />
              </svg>
            ) : isNegative ? (
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path d="M6 9.5L2 4.5H10L6 9.5Z" fill="currentColor" />
              </svg>
            ) : null}
            {isPositive ? '+' : ''}{change}%
          </span>
        )}
      </div>
    </div>
  );
});

export default StatCard;
