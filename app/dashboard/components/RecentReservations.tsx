interface RecentReservation {
  id: string;
  activityName: string;
  userName: string;
  userEmail: string;
  date: string;
}

interface RecentReservationsProps {
  reservations: RecentReservation[];
}

export default function RecentReservations({ reservations }: RecentReservationsProps) {
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Réservations récentes
        </h3>
        <div className="mt-5">
          <div className="flow-root">
            <ul role="list" className="-my-5 divide-y divide-gray-200">
              {reservations.map((reservation) => (
                <li key={reservation.id} className="py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {reservation.activityName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {reservation.userName} ({reservation.userEmail})
                      </p>
                    </div>
                    <div className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
                      {new Date(reservation.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
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