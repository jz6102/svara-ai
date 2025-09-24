"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast } from 'sonner';

interface Task {
  _id: string;
  status: 'todo' | 'in-progress' | 'done';
  deadline: string;
}

interface Project {
  _id: string;
  name: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalProjects: 0,
    tasksByStatus: { todo: 0, 'in-progress': 0, done: 0 },
    overdueTasks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const projectsRes = await api.get('/projects');
        const projects: Project[] = projectsRes.data;
        let allTasks: Task[] = [];

        // Fetch tasks for all projects concurrently for speed
        const taskPromises = projects.map(project => 
          api.get(`/tasks/project/${project._id}?limit=1000`)
        );
        const tasksResults = await Promise.all(taskPromises);
        tasksResults.forEach(res => {
          allTasks = [...allTasks, ...res.data.tasks];
        });

        const tasksByStatus = allTasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, { todo: 0, 'in-progress': 0, done: 0 });

        const overdueTasks = allTasks.filter(task => 
          task.status !== 'done' && task.deadline && new Date(task.deadline) < new Date()
        ).length;

        setStats({
          totalProjects: projects.length,
          tasksByStatus,
          overdueTasks,
        });
      } catch (error) {
        toast.error("Failed to fetch dashboard data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const chartData = [
    { name: 'Todo', count: stats.tasksByStatus.todo },
    { name: 'In Progress', count: stats.tasksByStatus['in-progress'] },
    { name: 'Done', count: stats.tasksByStatus.done },
  ];

  if (loading) {
    return <div className="text-center">Loading dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-400">Total Projects</h3>
          <p className="text-4xl font-bold">{stats.totalProjects}</p>
        </div>
        <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-400">Total Tasks</h3>
          <p className="text-4xl font-bold">{chartData.reduce((sum, item) => sum + item.count, 0)}</p>
        </div>
        <div className="p-6 bg-zinc-900 rounded-lg border border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-400">Overdue Tasks</h3>
          <p className="text-4xl font-bold text-red-500">{stats.overdueTasks}</p>
        </div>
      </div>

      <div className="p-6 bg-zinc-900 rounded-lg h-80 border border-zinc-800">
        <h2 className="text-2xl font-bold mb-4">Tasks by Status</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--card))" />
            <XAxis dataKey="name" stroke="hsl(var(--foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--foreground))" fontSize={12}/>
            <Tooltip cursor={{fill: 'hsla(var(--card), 0.5)'}} contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--card))' }} />
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}