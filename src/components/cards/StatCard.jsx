import { memo } from 'react';
import { formatNumber } from '../../utils/formatUtils';

const StatCard = memo(({ icon, label, value = 0, change, color = 'bg-lime' }) => {
  const isPositive = change > 0;
  const isNegative = change < 0;

  return (
    <div className="card-neubrutal">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-xl ${color}`}>
          {icon}
        </div>
      </div>
      <p className="card-stat-value">{formatNumber(value)}</p>
      <div className="flex items-center gap-2 mt-1">
        <p className="text-sm" style={{fontSize:14,color:'var(--color-text-muted)'}}>{label}</p>
        {change !== undefined && change !== null && (
          <span
            className={`card-stat-change ${
              isPositive ? 'card-stat-change-pos' : isNegative ? 'card-stat-change-neg' : ''
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
