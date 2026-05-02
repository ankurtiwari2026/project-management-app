import StatusBadge from './StatusBadge';
import { useAuth } from '../context/AuthContext';

const TaskCard = ({ task, onStatusChange, onDelete }) => {
  const { isAdmin } = useAuth();

  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== 'Completed';

  return (
    <div className={`card border-l-4 ${
      task.status === 'Completed'
        ? 'border-l-green-400'
        : isOverdue
        ? 'border-l-red-400'
        : task.status === 'In Progress'
        ? 'border-l-blue-400'
        : 'border-l-yellow-400'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 truncate">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
          )}
        </div>
        <StatusBadge status={task.status} />
      </div>

      <div className="mt-3 space-y-1 text-xs text-gray-500">
        {task.assignedTo && (
          <p>👤 <span className="font-medium">{task.assignedTo.name}</span></p>
        )}
        {task.project && (
          <p>📁 <span className="font-medium">{task.project.name}</span></p>
        )}
        {task.deadline && (
          <p className={isOverdue ? 'text-red-500 font-semibold' : ''}>
            📅 {new Date(task.deadline).toLocaleDateString()}
            {isOverdue && ' — Overdue!'}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="text-xs border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 flex-1"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {isAdmin && (
          <button
            onClick={() => onDelete(task._id)}
            className="text-xs text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
          >
            🗑 Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
