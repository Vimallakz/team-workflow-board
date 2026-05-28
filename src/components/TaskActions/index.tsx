import type { FC } from "react";
import { useStore } from "../../store";
import { useBoardActions } from "../../store/actions/board.action";
import type { BoardSortField, SortDirection } from "../../types/board.types";
import { AppSelect, type AppSelectOption } from "../AppSelect";

type SortOptionValue = `${BoardSortField}:${SortDirection}`;

const SORT_OPTIONS: AppSelectOption[] = [
  { value: "createdAt:desc", label: "Newest Created" },
  { value: "createdAt:asc", label: "Oldest Created" },
  { value: "updatedAt:desc", label: "Recently Updated" },
  { value: "updatedAt:asc", label: "Least Recently Updated" },
  { value: "priority:desc", label: "Priority High → Low" },
  { value: "priority:asc", label: "Priority Low → High" },
];

export const TaskActions: FC = () => {
  const { sortField, sortDirection } = useStore((state) => state.board);
  const { setSort } = useBoardActions();

  const value: SortOptionValue = `${sortField}:${sortDirection}`;

  const handleSortChange = (nextValue: string) => {
    const [field, direction] = nextValue.split(":") as [
      BoardSortField,
      SortDirection,
    ];
    setSort(field, direction);
  };

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-slate-600">Sort By</span>
        <AppSelect value={value} options={SORT_OPTIONS} onChange={handleSortChange}/>
      </div>
    </div>
  );
};
