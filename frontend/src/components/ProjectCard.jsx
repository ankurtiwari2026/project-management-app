import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProjectCard = ({ project, onDelete }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-800 text-lg truncate">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
        <span>👥 {project.members?.length || 0} members</span>
        <span>📅 {new Date(project.createdAt).toLocaleDateString()}</span>
      </div>

      {project.members?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {project.members.slice(0, 4).map((m) => (
            <span key={m._id} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full">
              {m.name}
            </span>
          ))}
          {project.members.length > 4 && (
            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
              +{project.members.length - 4} more
            </span>
          )}
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Link
          to={`/projects/${project._id}`}
          className="flex-1 text-center text-sm btn-primary"
        >
          View Project
        </Link>
        {isAdmin && (
          <button
            onClick={() => onDelete(project._id)}
            className="text-sm btn-danger px-3 py-2"
          >
            🗑
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
