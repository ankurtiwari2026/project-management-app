import { useEffect, useState } from 'react';
import { taskService } from '../services/projectService';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ label, value, color, icon }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await taskService.getStats();
        setStats(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.name}! 👋
        </h2>
        <p className="text-gray-500 mt-1">
          {isAdmin
            ? "Here's an overview of all tasks in your workspace."
            : "Here's your personal task overview."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Tasks"
          value={stats?.total ?? 0}
          color="bg-indigo-100"
          icon="📋"
        />
        <StatCard
          label="Completed"
          value={stats?.completed ?? 0}
          color="bg-green-100"
          icon="✅"
        />
        <StatCard
          label="In Progress"
          value={stats?.inProgress ?? 0}
          color="bg-blue-100"
          icon="⚡"
        />
        <StatCard
          label="Overdue"
          value={stats?.overdue ?? 0}
          color="bg-red-100"
          icon="⏰"
        />
      </div>

      {/* Progress Overview */}
      {stats?.total > 0 && (
        <div className="card mb-8">
          <h3 className="font-semibold text-gray-700 mb-4">Completion Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.round((stats.completed / stats.total) * 100)}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {Math.round((stats.completed / stats.total) * 100)}% of tasks completed
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-3">📊 Task Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'Pending', value: stats?.pending, color: 'bg-yellow-400' },
              { label: 'In Progress', value: stats?.inProgress, color: 'bg-blue-400' },
              { label: 'Completed', value: stats?.completed, color: 'bg-green-400' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-20">{item.label}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{
                      width: stats?.total ? `${(item.value / stats.total) * 100}%` : '0%',
                    }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-700 w-6">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card flex flex-col justify-between">
          <h3 className="font-semibold text-gray-700 mb-3">⚠️ Needs Attention</h3>
          {stats?.overdue > 0 ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-semibold text-2xl">{stats.overdue}</p>
              <p className="text-red-600 text-sm mt-1">
                task{stats.overdue > 1 ? 's are' : ' is'} past deadline and not yet completed.
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-semibold">🎉 All on track!</p>
              <p className="text-green-600 text-sm mt-1">No overdue tasks. Great work!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
