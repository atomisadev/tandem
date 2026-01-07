"use client";

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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Keyboard, ActivitySquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Task } from "../../_hooks/use-project";

interface KanbanBoardProps {
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
  tasks: initialTasks,
  onTaskClick,
}: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const sensors = useSensors(
    useSensor(PointerSensor),
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
          newTasks[activeIndex].status = tasks[overIndex].status;
          return arrayMove(newTasks, activeIndex, overIndex);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const newTasks = [...tasks];
        newTasks[activeIndex].status = overId as string;
        return arrayMove(newTasks, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid h-full grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            tasks={tasks.filter((t) => t.status === col.id)}
            onTaskClick={onTaskClick}
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
    </DndContext>
  );
}

function KanbanColumn({
  id,
  title,
  tasks,
  onTaskClick,
}: {
  id: string;
  title: string;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
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
      className="flex h-full flex-col rounded-xl bg-muted/50 p-4 border border-border/50"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm">{title}</h3>
          <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
            {tasks.length}
          </Badge>
        </div>
        <Button variant="ghost" size="icon-xs" className="h-6 w-6">
          <Plus className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex flex-1 flex-col gap-2 min-h-[100px]">
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
        className="h-[100px] rounded-lg border-2 border-primary/20 bg-muted/50 opacity-50"
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      onClick={() => onClick(task)}
      className={cn(
        "cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors group relative",
        isOverlay ? "rotate-2 shadow-xl cursor-grabbing scale-105 z-50" : ""
      )}
    >
      <CardHeader className="p-3 space-y-0 pb-1">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium leading-none line-clamp-2">
            {task.title}
          </CardTitle>
          <div
            {...attributes}
            {...listeners}
            className="text-muted-foreground/30 hover:text-foreground cursor-grab p-0.5 rounded -mr-1"
          >
            <GripVertical className="h-3.5 w-3.5" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-2">
        <p className="text-xs text-muted-foreground line-clamp-2">
          {task.description || "No description"}
        </p>
      </CardContent>
    </Card>
  );
}
