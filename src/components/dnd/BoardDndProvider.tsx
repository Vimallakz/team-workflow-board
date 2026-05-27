import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { FC, PropsWithChildren } from 'react';
import type { Task } from '../../types/board.types';
import { TaskCard } from '../TaskCard';

interface BoardDndProviderProps extends PropsWithChildren {
  activeTask: Task | null;
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel: () => void;
}

export const BoardDndProvider: FC<BoardDndProviderProps> = ({
  activeTask,
  onDragStart,
  onDragOver,
  onDragEnd,
  onDragCancel,
  children,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      {children}

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="cursor-grabbing shadow-xl ring-2 ring-indigo-400/60">
            <TaskCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
