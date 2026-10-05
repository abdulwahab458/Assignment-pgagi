"use client";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ContentItem } from "@/types/content";
import { ContentCard } from "@/components/content/ContentCard";
import { useAppDispatch } from "@/store/hooks";
import { setFeedOrder } from "@/store/slices/uiSlice";

function SortableCard({ item }: { item: ContentItem }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <ContentCard
        item={item}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function DraggableFeedGrid({
  items,
  order,
  onOrderChange,
}: {
  items: ContentItem[];
  order: string[];
  onOrderChange: (ids: string[]) => void;
}) {
  const dispatch = useAppDispatch();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const orderedItems = (() => {
    if (order.length === 0) return items;
    const map = new Map(items.map((i) => [i.id, i]));
    const sorted = order.map((id) => map.get(id)).filter(Boolean) as ContentItem[];
    const rest = items.filter((i) => !order.includes(i.id));
    return [...sorted, ...rest];
  })();

  const ids = orderedItems.map((i) => i.id);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;
    const next = [...ids];
    const [removed] = next.splice(oldIndex, 1);
    next.splice(newIndex, 0, removed);
    onOrderChange(next);
    dispatch(setFeedOrder(next));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={ids} strategy={rectSortingStrategy}>
        <ul className="grid list-none gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {orderedItems.map((item) => (
            <li key={item.id}>
              <SortableCard item={item} />
            </li>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}
