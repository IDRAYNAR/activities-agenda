interface TopActivity {
  id: string;
  name: string;
  reservationCount: number;
}

interface TopActivitiesProps {
  activities: TopActivity[];
}

export default function TopActivities({ activities }: TopActivitiesProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Activités les plus populaires
        </h3>
        <div className="mt-5">
          <div className="flow-root">
            <ul role="list" className="-my-5 divide-y divide-gray-200">
              {activities.map((activity) => (
                <li key={activity.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {activity.name}
                      </p>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                      {activity.reservationCount} réservation{activity.reservationCount > 1 ? 's' : ''}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 