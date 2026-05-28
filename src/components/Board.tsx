import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { FC, ReactNode } from "react";
import { useMemo, useState } from "react";
import { useStore } from "../store";
import { useBoardActions } from "../store/actions/board.action";
import type { Task, TaskStatus } from "../types/board.types";
import { groupByStatus, TASK_STATUSES } from "../utils/util";
import { AppSideDrawer } from "./AppSideDrawer";
import { AddEditTask } from "./AddEditTask";
import { BoardColumn } from "./BoardColumn";
import { TaskCard } from "./TaskCard";
import { SortableItem } from "./dnd/SortableItem";
import { BoardDndProvider } from "./dnd/BoardDndProvider";

const STATUS_TITLES: Record<TaskStatus, string> = {
  backlog: "Backlog",
  "in-progress": "In Progress",
  done: "Done",
};

export const Board: FC = () => {
  const { tasks, columns, selectedPriorities, searchQuery } = useStore(
    (state) => state.board,
  );
  const { moveTask } = useBoardActions();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [drawerMode, setDrawerMode] = useState<"add" | "edit" | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [overColumnStatus, setOverColumnStatus] = useState<TaskStatus | null>(
    null,
  );

  /**
   * Based on filters searchQuery, selectedPriorities, filter the tasks
   */
  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();
    return tasks.filter((task) => {
      const priorityMatch = selectedPriorities.includes(task.priority);
      if (!priorityMatch) return false;

      if (!normalizedSearch) return true;

      const title = task.title.toLowerCase();
      const description = task.description.toLowerCase();
      return (
        title.includes(normalizedSearch) ||
        description.includes(normalizedSearch)
      );
    });
  }, [searchQuery, selectedPriorities, tasks]);

  const grouped = useMemo(() => groupByStatus(filteredTasks), [filteredTasks]);

  const resolveOverColumn = (
    over: DragOverEvent["over"],
  ): TaskStatus | null => {
    if (!over) return null;

    const overId = over.id as string;
    if (TASK_STATUSES.includes(overId as TaskStatus)) {
      return overId as TaskStatus;
    }

    const overTask = filteredTasks.find((t) => t.id === overId);
    if (overTask) return overTask.status;

    const status = over.data.current?.status as TaskStatus | undefined;
    if (status && TASK_STATUSES.includes(status)) return status;

    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = filteredTasks.find((t) => t.id === event.active.id);
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
    const sourceTask = filteredTasks.find((t) => t.id === activeId);
    if (!sourceTask) return;

    const sourceStatus = sourceTask.status;

    const overTask = filteredTasks.find((t) => t.id === overId);
    if (!overTask) return;

    const targetStatus = overTask.status;
    const columnTasks = [...grouped[targetStatus]];
    const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
    const overIndex = columnTasks.findIndex((t) => t.id === overId);

    if (oldIndex === -1) {
      // Cross-column: insert at over task's index in target (excluding active)
      const listWithoutActive = columnTasks.filter((t) => t.id !== activeId);
      const newIndex = listWithoutActive.findIndex((t) => t.id === overId);
      moveTask(
        activeId,
        targetStatus,
        newIndex === -1 ? listWithoutActive.length : newIndex,
      );
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
    setDrawerMode(null);
    setEditingTask(null);
  };

  const openAddDrawer = () => {
    setEditingTask(null);
    setDrawerMode("add");
  };

  const openEditDrawer = (task: Task) => {
    setEditingTask(task);
    setDrawerMode("edit");
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
              <TaskCard task={task} onClick={() => openEditDrawer(task)} />
            </SortableItem>
          ))}
        </SortableContext>
      </BoardColumn>
    );
  };

  const isDrawerOpen = drawerMode !== null;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex shrink-0 justify-end">
        <button
          type="button"
          onClick={openAddDrawer}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
        >
          Add Task
        </button>
      </div>

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
        open={isDrawerOpen}
        onClose={closeDrawer}
        side="right"
        title={drawerMode === "add" ? "Add Task" : "Edit Task"}
      >
        {drawerMode ? (
          <AddEditTask
            mode={drawerMode}
            task={editingTask ?? undefined}
            onSuccess={closeDrawer}
            onCancel={closeDrawer}
          />
        ) : null}
      </AppSideDrawer>
    </div>
  );
};
