import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { format, isPast, isToday } from 'date-fns';
import { GripVertical } from 'lucide-react';

// Define the structure of a full Task object
export interface Task {
  _id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  deadline?: string;
  status: 'todo' | 'in-progress' | 'done';
}

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

// Map priorities to Tailwind CSS classes for the color-coded border
const priorityClasses = {
  low: 'border-l-green-500',
  medium: 'border-l-yellow-500',
  high: 'border-l-red-500',
};

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  // `useSortable` hook from dnd-kit provides props to make the component draggable
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getDeadlineColor = () => {
    if (!task.deadline || task.status === 'done') return 'text-zinc-400';
    const deadLineDate = new Date(task.deadline);
    if (isPast(deadLineDate) && !isToday(deadLineDate)) return 'text-red-500 font-semibold';
    if (isToday(deadLineDate)) return 'text-yellow-500 font-semibold';
    return 'text-zinc-400';
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 bg-zinc-800 rounded-lg shadow-md mb-4 flex items-start gap-3 border-l-4 ${priorityClasses[task.priority]}`}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing touch-none py-2">
        <GripVertical size={16} className="text-zinc-500" />
      </div>
      <div className="flex-grow" onClick={onClick} >
        <p className="font-semibold">{task.title}</p>
        {task.deadline && (
          <p className={`text-xs mt-2 ${getDeadlineColor()}`}>
            Due: {format(new Date(task.deadline), 'MMM dd, yyyy')}
          </p>
        )}
      </div>
    </div>
  );
};