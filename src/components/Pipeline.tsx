import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { Stage } from './Stage';
import { usePipelineStore } from '../store';
import { Deal } from '../types';
import { DealCard } from './DealCard';

export function Pipeline() {
  const [activeDeal, setActiveDeal] = React.useState<Deal | null>(null);
  const [activeStageId, setActiveStageId] = React.useState<string | null>(null);
  
  const stages = usePipelineStore((state) => state.stages);
  const moveDeal = usePipelineStore((state) => state.moveDeal);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const stageId = stages.find((stage) =>
      stage.deals.some((deal) => deal.id === active.id)
    )?.id;
    
    if (stageId) {
      const deal = stages
        .find((s) => s.id === stageId)
        ?.deals.find((d) => d.id === active.id);
      
      if (deal) {
        setActiveDeal(deal);
        setActiveStageId(stageId);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && activeStageId) {
      const toStageId = over.id as string;
      if (toStageId !== activeStageId) {
        moveDeal(active.id as string, activeStageId, toStageId);
      }
    }

    setActiveDeal(null);
    setActiveStageId(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-6 min-h-[calc(100vh-10rem)]">
        {stages.map((stage) => (
          <Stage key={stage.id} stage={stage} />
        ))}
      </div>
      <DragOverlay>
        {activeDeal ? (
          <div className="w-[350px]">
            <DealCard deal={activeDeal} stageId={activeStageId || ''} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}