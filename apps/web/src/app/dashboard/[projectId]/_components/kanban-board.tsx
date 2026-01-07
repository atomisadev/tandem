import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "../../_hooks/use-project";
import { useCreateTask, useUpdateTask } from "../../_hooks/use-project";
import { CreateTaskDialog } from "./create-task-dialog";
import { toast } from "sonner";

interface KanbanBoardProps {
  projectId: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

type ColumnType = "todo" | "in-progress" | "done";

const COLUMNS: { id: ColumnType; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "in-progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export function KanbanBoard({
  projectId,
  tasks: initialTasks,
  onTaskClick,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeColId, setActiveColId] = useState<string>("todo");

  const { mutateAsync: createTask } = useCreateTask();
  const { mutate: updateTask } = useUpdateTask();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newTasks = [...tasks];
          newTasks[activeIndex] = {
            ...newTasks[activeIndex],
            status: tasks[overIndex].status,
          };
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const newTasks = [...tasks];

        if (newTasks[activeIndex].status !== overId) {
          newTasks[activeIndex] = {
            ...newTasks[activeIndex],
            status: overId as string,
          };
          return arrayMove(newTasks, activeIndex, activeIndex);
        }
        return newTasks;
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const taskId = active.id as string;

    const task = tasks.find((t) => t.id === taskId);

    if (task && over) {
      updateTask(
        {
          taskId,
          projectId,
          data: { status: task.status },
        },
        {
          onError: () => {
            toast.error("Failed to move task");
          },
        }
      );
    }

    setActiveId(null);
  };

  const openCreateDialog = (columnId: string) => {
    setActiveColId(columnId);
    setIsDialogOpen(true);
  };

  const handleCreateTask = async (title: string) => {
    await createTask({
      projectId,
      title,
      status: activeColId,
    });
    toast.success("Task created");
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid h-full grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.id)}
            onTaskClick={onTaskClick}
            onAddClick={() => openCreateDialog(col.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeId ? (
          <TaskCard
            task={tasks.find((t) => t.id === activeId)!}
            onClick={() => {}}
            isOverlay
          />
        ) : null}
      </DragOverlay>

      <CreateTaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        status={activeColId}
        onCreate={handleCreateTask}
      />
    </DndContext>
  );
}

function KanbanColumn({
  id,
  title,
  tasks,
  onTaskClick,
  onAddClick,
}: {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddClick: () => void;
}) {
  const { setNodeRef } = useSortable({
    id: id,
    data: {
      type: "Column",
    },
  });

  return (
    <div
      ref={setNodeRef}
      className="flex h-full flex-col rounded-xl bg-muted/20 border-2 border-dashed border-border/50 px-4 py-4"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
            {tasks.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          className="h-6 w-6"
          onClick={onAddClick}
        >
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto min-h-0">
        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

function TaskCard({
  task,
  onClick,
  isOverlay,
}: {
  task: Task;
  onClick: (task: Task) => void;
  isOverlay?: boolean;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[60px] w-full rounded-md border border-dashed border-primary/40 bg-muted/50 opacity-50"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onClick(task)}
      className={cn(
        "flex flex-col gap-1.5 rounded-md border bg-card p-2.5 text-card-foreground shadow-sm transition-all hover:ring-2 hover:ring-primary/20 hover:border-primary/50 cursor-grab active:cursor-grabbing group select-none relative",
        isOverlay
          ? "rotate-2 scale-105 z-50 shadow-xl cursor-grabbing ring-2 ring-primary/20"
          : ""
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-sm leading-tight">{task.title}</span>
      </div>
      {task.description && (
        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}
    </div>
  );
}
