import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Deal } from '../types';
import { GripVertical, Trash2, Building2, User } from 'lucide-react';
import { usePipelineStore } from '../store';
import { Button } from './ui/button';
import { CustomerDialog } from './CustomerDialog';

interface DealCardProps {
  deal: Deal;
  stageId: string;
}

export function DealCard({ deal, stageId }: DealCardProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: deal.id,
  });
  const deleteDeal = usePipelineStore((state) => state.deleteDeal);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        onClick={() => setDialogOpen(true)}
        className="bg-white rounded-lg shadow-sm border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div {...attributes} {...listeners} className="mt-1" onClick={(e) => e.stopPropagation()}>
              <GripVertical className="h-5 w-5 text-slate-400 hover:text-slate-600" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-medium text-slate-900">{deal.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                  <Building2 className="h-3.5 w-3.5" />
                  <span>{deal.company}</span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                  <User className="h-3.5 w-3.5" />
                  <span>{deal.contact}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-lg font-semibold text-green-600">
                  ${deal.value.toLocaleString()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDeal(stageId, deal.id);
                  }}
                  className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomerDialog 
        deal={deal}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}