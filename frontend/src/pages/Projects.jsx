import { useEffect, useState } from 'react';
import { projectService, userService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', members: [] });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    try {
      const { data } = await projectService.getAll();
      setProjects(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    if (isAdmin) {
      userService.getMembers().then(({ data }) => setMembers(data.data));
    }
  }, [isAdmin]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project and all its tasks?')) return;
    try {
      await projectService.delete(id);
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const { data } = await projectService.create(form);
      setProjects((prev) => [data.data, ...prev]);
      setShowModal(false);
      setForm({ name: '', description: '', members: [] });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleMember = (id) => {
    setForm((prev) => ({
      ...prev,
      members: prev.members.includes(id)
        ? prev.members.filter((m) => m !== id)
        : [...prev.members, id],
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
          <p className="text-gray-500 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-5xl mb-4">📁</p>
          <p className="text-gray-500 text-lg">No projects yet.</p>
          {isAdmin && (
            <button onClick={() => setShowModal(true)} className="btn-primary mt-4">
              Create your first project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-gray-800">New Project</h3>
                <button
                  onClick={() => { setShowModal(false); setError(''); }}
                  className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                >×</button>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Website Redesign"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    placeholder="Brief description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Add Members</label>
                  <div className="max-h-40 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3">
                    {members.length === 0 ? (
                      <p className="text-sm text-gray-400">No members available</p>
                    ) : (
                      members.map((m) => (
                        <label key={m._id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
                          <input
                            type="checkbox"
                            checked={form.members.includes(m._id)}
                            onChange={() => toggleMember(m._id)}
                            className="accent-indigo-600"
                          />
                          <span className="text-sm">{m.name}</span>
                          <span className="text-xs text-gray-400">{m.email}</span>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" disabled={submitting} className="flex-1 btn-primary">
                    {submitting ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
