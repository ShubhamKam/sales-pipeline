import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Stage as StageType } from '../types';
import { DealCard } from './DealCard';
import { Plus } from 'lucide-react';
import { usePipelineStore } from '../store';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface StageProps {
  stage: StageType;
}

export function Stage({ stage }: StageProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newDeal, setNewDeal] = useState({
    title: '',
    value: 0,
    company: '',
    contact: '',
  });

  const { setNodeRef } = useDroppable({
    id: stage.id,
  });

  const addDeal = usePipelineStore((state) => state.addDeal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addDeal(stage.id, newDeal);
    setNewDeal({ title: '', value: 0, company: '', contact: '' });
    setIsAdding(false);
  };

  return (
    <div className="flex-shrink-0 w-[350px] bg-white rounded-xl shadow-sm border border-slate-200">
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">{stage.title}</h2>
          <span className="px-2.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-600 rounded-full">
            {stage.deals.length}
          </span>
        </div>
      </div>
      
      <div ref={setNodeRef} className="p-4 space-y-3">
        {stage.deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} stageId={stage.id} />
        ))}
        
        {isAdding ? (
          <form onSubmit={handleSubmit} className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Deal title</Label>
              <Input
                id="title"
                placeholder="Enter deal title"
                value={newDeal.title}
                onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              <Input
                id="value"
                type="number"
                placeholder="Enter deal value"
                value={newDeal.value}
                onChange={(e) => setNewDeal({ ...newDeal, value: Number(e.target.value) })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Enter company name"
                value={newDeal.company}
                onChange={(e) => setNewDeal({ ...newDeal, company: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact">Contact</Label>
              <Input
                id="contact"
                placeholder="Enter contact name"
                value={newDeal.contact}
                onChange={(e) => setNewDeal({ ...newDeal, contact: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="flex-1">
                Add Deal
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAdding(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            variant="outline"
            onClick={() => setIsAdding(true)}
            className="w-full bg-slate-50 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Deal
          </Button>
        )}
      </div>
    </div>
  );
}