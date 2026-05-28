import type { FC } from "react";
import { useStore } from "../../store";
import { useBoardActions } from "../../store/actions/board.action";
import type {
  BoardSortField,
  SortDirection,
  TaskPriority,
} from "../../types/board.types";
import { AppInput } from "../AppInput";
import { AppMultiSelect, type AppMultiSelectOption } from "../AppMultiSelect";
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

const PRIORITY_OPTIONS: AppMultiSelectOption[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const TaskActions: FC = () => {
  const { sortField, sortDirection, selectedPriorities, searchQuery } = useStore(
    (state) => state.board,
  );
  const { setSort, setSelectedPriorities, setSearchQuery } = useBoardActions();

  const value: SortOptionValue = `${sortField}:${sortDirection}`;

  const handleSortChange = (nextValue: string) => {
    const [field, direction] = nextValue.split(":") as [
      BoardSortField,
      SortDirection,
    ];
    setSort(field, direction);
  };

  const handlePriorityChange = (values: string[]) => {
    setSelectedPriorities(values as TaskPriority[]);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-600">Search</span>
        <AppInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Title or description"
          className="min-w-[220px]"
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-600">Priority</span>
        <AppMultiSelect
          values={selectedPriorities}
          options={PRIORITY_OPTIONS}
          onChange={handlePriorityChange}
        />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Sort By</span>
        <AppSelect value={value} options={SORT_OPTIONS} onChange={handleSortChange}/>
      </div>
    </div>
  );
};
