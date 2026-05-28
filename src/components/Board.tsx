import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { FC, ReactNode } from 'react';
import { useMemo, useState } from 'react';
import { useStore } from '../store';
import { useBoardActions } from '../store/actions/board.action';
import type { Task, TaskStatus } from '../types/board.types';
import { groupTasksByStatus, TASK_STATUSES } from '../utils/util';
import { AppSideDrawer } from './AppSideDrawer';
import { BoardColumn } from './BoardColumn';
import { TaskCard } from './TaskCard';
import { SortableItem } from './dnd/SortableItem';
import { BoardDndProvider } from './dnd/BoardDndProvider';

const STATUS_TITLES: Record<TaskStatus, string> = {
  backlog: 'Backlog',
  'in-progress': 'In Progress',
  done: 'Done',
};

export const Board: FC = () => {
  const { tasks, columns } = useStore((state) => state.board);
  const { moveTask } = useBoardActions();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [overColumnStatus, setOverColumnStatus] = useState<TaskStatus | null>(null);

  const grouped = useMemo(() => groupTasksByStatus(tasks), [tasks]);

  const resolveOverColumn = (over: DragOverEvent['over']): TaskStatus | null => {
    if (!over) return null;

    const overId = over.id as string;
    if (TASK_STATUSES.includes(overId as TaskStatus)) {
      return overId as TaskStatus;
    }

    const overTask = tasks.find((t) => t.id === overId);
    if (overTask) return overTask.status;

    const status = over.data.current?.status as TaskStatus | undefined;
    if (status && TASK_STATUSES.includes(status)) return status;

    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
    setOverColumnStatus(task?.status ?? null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverColumnStatus(resolveOverColumn(event.over));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    setOverColumnStatus(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id as string;
    const overId = over.id as string;
    const sourceTask = tasks.find((t) => t.id === activeId);
    if (!sourceTask) return;

    const sourceStatus = sourceTask.status;

    const overTask = tasks.find((t) => t.id === overId);
    if (!overTask) return;

    const targetStatus = overTask.status;
    const columnTasks = [...grouped[targetStatus]];
    const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
    const overIndex = columnTasks.findIndex((t) => t.id === overId);

    if (oldIndex === -1) {
      // Cross-column: insert at over task's index in target (excluding active)
      const listWithoutActive = columnTasks.filter((t) => t.id !== activeId);
      const newIndex = listWithoutActive.findIndex((t) => t.id === overId);
      moveTask(activeId, targetStatus, newIndex === -1 ? listWithoutActive.length : newIndex);
      return;
    }

    // Same column: use arrayMove for correct index
    if (oldIndex === overIndex) return;

    const reordered = arrayMove(columnTasks, oldIndex, overIndex);
    const newIndex = reordered.findIndex((t) => t.id === activeId);
    moveTask(activeId, sourceStatus, newIndex);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
    setOverColumnStatus(null);
  };

  const closeDrawer = () => {
    setSelectedTask(null);
  };

  const renderColumn = (status: TaskStatus): ReactNode => {
    const columnTasks = grouped[status];
    const colMeta = columns.find((c) => c.id === status);

    return (
      <BoardColumn
        key={status}
        status={status}
        title={colMeta?.title ?? STATUS_TITLES[status]}
        taskCount={columnTasks.length}
        isHighlighted={overColumnStatus === status}
      >
        <SortableContext
          items={columnTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {columnTasks.map((task) => (
            <SortableItem key={task.id} id={task.id} status={task.status}>
              <TaskCard task={task} onClick={() => setSelectedTask(task)} />
            </SortableItem>
          ))}
        </SortableContext>
      </BoardColumn>
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <BoardDndProvider
        activeTask={activeTask}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <div className="flex h-full min-h-0 gap-4">
          {TASK_STATUSES.map((status) => renderColumn(status))}
        </div>
      </BoardDndProvider>

      <AppSideDrawer
        open={Boolean(selectedTask)}
        onClose={closeDrawer}
        side="right"
        title="Edit Task"
      >
        <div className="p-4 text-sm">Coming soon...</div>
      </AppSideDrawer>
    </div>
  );
};
