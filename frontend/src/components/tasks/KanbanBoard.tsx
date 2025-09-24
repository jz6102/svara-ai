"use client";
import React, { useMemo } from 'react';
import { DndContext, closestCenter, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard, Task as TaskType } from './TaskCard';

// Define the structure for a Kanban column
interface Column {
  id: 'todo' | 'in-progress' | 'done';
  title: string;
}
const columns: Column[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

// Reusable Column Component
const KanbanColumn = ({ column, tasks, onTaskClick }: { column: Column; tasks: TaskType[], onTaskClick: (task: TaskType) => void; }) => {
  const { setNodeRef } = useSortable({ id: column.id });

  return (
    <div ref={setNodeRef} className="bg-zinc-900 rounded-lg p-4 w-full h-full flex flex-col">
      <h3 className="font-bold text-lg mb-4 px-1">{column.title} <span className="text-sm font-normal text-zinc-500">{tasks.length}</span></h3>
      <SortableContext items={tasks.map(t => t._id)} >
        <div className="flex-grow space-y-1 min-h-[150px]">
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} onClick={() => onTaskClick(task)} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

interface KanbanBoardProps {
  tasks: TaskType[];
  onDragEnd: (activeId: string, overId: string | null) => void;
  onTaskClick: (task: TaskType) => void;
}

export const KanbanBoard = ({ tasks, onDragEnd, onTaskClick }: KanbanBoardProps) => {
  const tasksById = useMemo(() => tasks.reduce((acc, task) => {
    acc[task._id] = task;
    return acc;
  }, {} as Record<string, TaskType>), [tasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id.toString();
    // over.id could be a column ID or a task ID. We need the column.
    const overId = columns.find(c => c.id === over.id) 
      ? over.id.toString() 
      : tasksById[over.id.toString()]?.status;

    if (overId) {
      onDragEnd(activeId, overId);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <SortableContext items={columns.map(c => c.id)} strategy={horizontalListSortingStrategy}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map(col => (
            <KanbanColumn
              key={col.id}
              column={col}
              tasks={tasks.filter(t => t.status === col.id)}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};