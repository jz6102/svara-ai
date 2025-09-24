"use client";
import React, { useState, useEffect } from 'react';
import { Input } from '../core/Input';
import { Button } from '../core/Button';

// This defines the structure of a task for the form
interface TaskFormData {
  _id?: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
}

interface TaskFormProps {
  task?: TaskFormData | null;
  onSave: (task: Partial<TaskFormData>) => void; // We send partial data to the API
  onCancel: () => void;
}

export const TaskForm = ({ task, onSave, onCancel }: TaskFormProps) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [deadline, setDeadline] = useState('');

  // When the 'task' prop changes (i.e., when we open the modal to edit),
  // this effect updates the form fields with the task's data.
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPriority(task.priority);
      // Format the date for the HTML date input, which expects "YYYY-MM-DD"
      setDeadline(task.deadline ? new Date(task.deadline).toISOString().substring(0, 10) : '');
    } else {
      // Reset form for creating a new task
      setTitle('');
      setPriority('medium');
      setDeadline('');
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      _id: task?._id, 
      title, 
      priority, 
      deadline: deadline || undefined, // Send undefined if the date is empty
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="w-full px-3 py-2 rounded-md bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-1">Deadline</label>
        <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" onClick={onCancel} className="bg-zinc-700 hover:bg-zinc-600">Cancel</Button>
        <Button type="submit">{task ? 'Update Task' : 'Create Task'}</Button>
      </div>
    </form>
  );
};