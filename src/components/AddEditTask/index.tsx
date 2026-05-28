import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useStore } from "../../store";
import { useBoardActions } from "../../store/actions/board.action";
import type { Task, TaskStatus } from "../../types/board.types";
import { groupByStatus } from "../../utils/util";
import { AppInput } from "../AppInput";
import { AppSelect, type AppSelectOption } from "../AppSelect";
import { AppTagsInput } from "../AppTagsInput";
import {
  taskFormSchema,
  type TaskFormValues,
} from "./taskForm.schema";

const STATUS_OPTIONS: AppSelectOption[] = [
  { value: "backlog", label: "Backlog" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

const PRIORITY_OPTIONS: AppSelectOption[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const emptyValues: TaskFormValues = {
  title: "",
  description: "",
  assignee: "",
  status: "backlog",
  priority: "medium",
  tags: [],
};

const toFormValues = (task: Task): TaskFormValues => ({
  title: task.title,
  description: task.description,
  assignee: task.assignee,
  status: task.status,
  priority: task.priority,
  tags: task.tags,
});

interface AddEditTaskProps {
  mode: "add" | "edit";
  task?: Task;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AddEditTask: FC<AddEditTaskProps> = ({
  mode,
  task,
  onSuccess,
  onCancel,
}) => {
  const tasks = useStore((state) => state.board.tasks);
  const { addTask, updateTask, moveTask } = useBoardActions();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: mode === "edit" && task ? toFormValues(task) : emptyValues,
  });

  useEffect(() => {
    reset(mode === "edit" && task ? toFormValues(task) : emptyValues);
  }, [mode, task, reset]);

  const onSubmit = handleSubmit((values) => {
    const now = new Date().toISOString();
    const status = values.status as TaskStatus;

    if (mode === "add") {
      const grouped = groupByStatus(tasks);
      const position = grouped[status].length;

      const newTask: Task = {
        id: uuidv4(),
        title: values.title,
        description: values.description,
        assignee: values.assignee,
        status,
        priority: values.priority,
        tags: values.tags,
        position,
        createdAt: now,
        updatedAt: now,
      };

      addTask(newTask);
      onSuccess();
      return;
    }

    if (!task) return;

    updateTask(task.id, {
      title: values.title,
      description: values.description,
      assignee: values.assignee,
      status,
      priority: values.priority,
      tags: values.tags,
    });

    if (status !== task.status) {
      const grouped = groupByStatus(
        tasks.filter((item) => item.id !== task.id),
      );
      moveTask(task.id, status, grouped[status].length);
    }

    onSuccess();
  });

  return (
    <form onSubmit={onSubmit} className="flex h-full flex-col">
      <div className="flex flex-1 flex-col gap-4 p-4">
        <AppInput
          label="Title"
          placeholder="Task title"
          {...register("title")}
          error={errors.title?.message}
        />

        <AppInput
          label="Assignee"
          placeholder="Assignee name"
          {...register("assignee")}
          error={errors.assignee?.message}
        />

        <AppInput
          label="Description"
          placeholder="What needs to be done?"
          multiline
          {...register("description")}
          error={errors.description?.message}
        />

        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <AppSelect
                label="Status"
                options={STATUS_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                selectWidthClassName="w-full"
                error={errors.status?.message}
              />
            )}
          />

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <AppSelect
                label="Priority"
                options={PRIORITY_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                selectWidthClassName="w-full"
                error={errors.priority?.message}
              />
            )}
          />
        </div>

        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <AppTagsInput
              label="Tags"
              tags={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              name={field.name}
              error={errors.tags?.message}
            />
          )}
        />
      </div>

      <footer className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {mode === "add" ? "Add Task" : "Save Changes"}
        </button>
      </footer>
    </form>
  );
};
