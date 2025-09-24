"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { Button } from '@/components/core/Button';
import { Modal } from '@/components/core/Modal';
import { TaskForm } from '@/components/tasks/TaskForm';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import type { Task } from '@/components/tasks/TaskCard';
import { toast } from 'sonner';
import { Plus, ArrowLeft } from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<{ name: string } | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectData = async () => {
      try {
        setLoading(true);
        // Using Promise.all to fetch project details and tasks in parallel
        const [projectRes, tasksRes] = await Promise.all([
          api.get(`/projects`), // We have to filter from all projects as there's no get-by-id endpoint
          api.get(`/tasks/project/${projectId}`)
        ]);
        const currentProject = projectRes.data.find((p: any) => p._id === projectId);
        setProject(currentProject);
        setTasks(tasksRes.data.tasks);
      } catch (error) {
        toast.error("Failed to fetch project data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjectData();
  }, [projectId]);

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (editingTask?._id) {
        // Update existing task
        const res = await api.put(`/tasks/${editingTask._id}`, taskData);
        setTasks(tasks.map(t => t._id === editingTask._id ? res.data : t));
        toast.success("Task updated successfully!");
      } else {
        // Create new task
        const res = await api.post('/tasks', { ...taskData, project: projectId });
        setTasks([...tasks, res.data]);
        toast.success("Task created successfully!");
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      toast.error("Failed to save task.");
    }
  };

  const handleDragEnd = async (activeId: string, newStatus: string | null) => {
    if (!newStatus) return;

    const task = tasks.find(t => t._id === activeId);
    if (task && task.status !== newStatus) {
      // Optimistic UI update for a smooth experience
      setTasks(prevTasks => prevTasks.map(t => 
        t._id === activeId ? { ...t, status: newStatus as Task['status'] } : t
      ));
      
      try {
        // API call to update the backend
        await api.put(`/tasks/${activeId}`, { status: newStatus });
      } catch (error) {
        toast.error("Failed to update task status.");
        // Revert UI on failure
        setTasks(prevTasks => prevTasks.map(t => 
          t._id === activeId ? { ...t, status: task.status } : t
        ));
      }
    }
  };
  
  const openTaskModal = (task: Task | null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };
  
  const closeTaskModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  if (loading) return <div>Loading board...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link href="/projects" className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-2">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
          <h1 className="text-3xl font-bold">{project?.name || 'Project Board'}</h1>
        </div>
        <Button onClick={() => openTaskModal(null)} className="flex items-center gap-2">
          <Plus size={16} /> Add Task
        </Button>
      </div>
      
      <KanbanBoard tasks={tasks} onDragEnd={handleDragEnd} onTaskClick={(task) => openTaskModal(task)} />

      <Modal 
        title={editingTask ? "Edit Task" : "Add New Task"} 
        isOpen={isModalOpen} 
        onClose={closeTaskModal}
      >
        <TaskForm 
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={closeTaskModal}
        />
      </Modal>
    </div>
  );
}