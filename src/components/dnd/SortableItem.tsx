import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FC, PropsWithChildren } from 'react';
import type { TaskStatus } from '../../types/board.types';

interface SortableItemProps extends PropsWithChildren {
  id: string;
  status: TaskStatus;
}

export const SortableItem: FC<SortableItemProps> = ({ id, status, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id,
      data: { type: 'task', status, taskId: id },
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};
