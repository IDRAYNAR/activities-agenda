interface StatsCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isUpward: boolean;
  };
}

export default function StatsCard({ title, value, icon, trend }: StatsCardProps) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                {trend && (
                  <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                    trend.isUpward ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trend.isUpward ? '↑' : '↓'}
                    <span className="sr-only">
                      {trend.isUpward ? 'Increased' : 'Decreased'} by
                    </span>
                    {trend.value}
                    <span className="ml-1">{trend.label}</span>
                  </div>
                )}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
} 