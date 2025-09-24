"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/core/Button';
import { Modal } from '@/components/core/Modal';
import { Input } from '@/components/core/Input';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

interface Project {
  _id: string;
  name: string;
  description: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (error) {
      toast.error("Failed to fetch projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name: newProjectName, description: newProjectDesc });
      toast.success("Project created!");
      setNewProjectName('');
      setNewProjectDesc('');
      setIsModalOpen(false);
      fetchProjects(); // Re-fetch to show the new project
    } catch (error) {
      toast.error("Failed to create project.");
    }
  };

  if (loading) return <div>Loading projects...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={16} /> Create Project
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Link href={`/projects/${project._id}`} key={project._id} className="block p-6 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-blue-500 transition-colors">
              <h3 className="font-bold text-lg mb-2 truncate">{project.name}</h3>
              <p className="text-sm text-zinc-400 line-clamp-2">{project.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed border-zinc-800 rounded-lg">
          <h2 className="text-xl font-semibold">No Projects Found</h2>
          <p className="text-zinc-400 mt-2">Get started by creating your first project.</p>
        </div>
      )}


      <Modal title="Create New Project" isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleCreateProject} className="space-y-4">
          <Input 
            placeholder="Project Name" 
            value={newProjectName} 
            onChange={(e) => setNewProjectName(e.target.value)} 
            required 
          />
          <Input 
            placeholder="Project Description" 
            value={newProjectDesc} 
            onChange={(e) => setNewProjectDesc(e.target.value)} 
          />
          <div className="flex justify-end gap-2">
            <Button type="button" onClick={() => setIsModalOpen(false)} className="bg-zinc-700 hover:bg-zinc-600">Cancel</Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}