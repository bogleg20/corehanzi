interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showNumbers?: boolean;
  color?: "red" | "green" | "blue" | "yellow";
  size?: "sm" | "md" | "lg";
}

export function ProgressBar({
  current,
  total,
  label,
  showNumbers = true,
  color = "red",
  size = "md",
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const colorClasses = {
    red: "bg-red-500",
    green: "bg-green-500",
    blue: "bg-blue-500",
    yellow: "bg-yellow-500",
  };

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className="w-full">
      {(label || showNumbers) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
          {showNumbers && (
            <span className="text-sm text-gray-500">
              {current} / {total} ({percentage}%)
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${colorClasses[color]} ${sizeClasses[size]} rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface CircularProgressProps {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

export function CircularProgress({
  current,
  total,
  size = 80,
  strokeWidth = 8,
  color = "#dc2626",
}: CircularProgressProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-300"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-lg font-bold">{current}</span>
        <span className="text-xs text-gray-500 block">/ {total}</span>
      </div>
    </div>
  );
}
