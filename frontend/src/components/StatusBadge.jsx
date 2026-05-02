const statusStyles = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  'Completed': 'bg-green-100 text-green-800',
};

const StatusBadge = ({ status }) => {
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-700'}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
