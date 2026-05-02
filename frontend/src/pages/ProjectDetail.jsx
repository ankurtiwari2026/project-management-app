import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectService, taskService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';

const ProjectDetail = () => {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          projectService.getById(id),
          taskService.getAll({ projectId: id }),
        ]);
        setProject(projRes.data.data);
        setTasks(taskRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleStatusChange = async (taskId, status) => {
    try {
      const { data } = await taskService.update(taskId, { status });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? data.data : t)));
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await taskService.delete(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      alert('Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Project not found.</p>
        <Link to="/projects" className="text-indigo-600 underline mt-2 inline-block">Back to Projects</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <Link to="/projects" className="text-sm text-indigo-600 hover:underline mb-4 inline-block">
        ← Back to Projects
      </Link>

      {/* Project Header */}
      <div className="card mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{project.name}</h2>
        {project.description && (
          <p className="text-gray-500 mt-2">{project.description}</p>
        )}

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
          <span>📅 Created: {new Date(project.createdAt).toLocaleDateString()}</span>
          <span>👤 By: {project.createdBy?.name}</span>
          <span>👥 {project.members?.length} members</span>
          <span>✅ {tasks.length} tasks</span>
        </div>

        {project.members?.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Team Members:</p>
            <div className="flex flex-wrap gap-2">
              {project.members.map((m) => (
                <span key={m._id} className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium">
                  {m.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tasks */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Tasks ({tasks.length})</h3>
        {isAdmin && (
          <Link to="/tasks" className="text-sm text-indigo-600 hover:underline">
            + Add Task from Tasks page
          </Link>
        )}
      </div>

      {tasks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-4xl mb-3">✅</p>
          <p className="text-gray-500">No tasks in this project yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
