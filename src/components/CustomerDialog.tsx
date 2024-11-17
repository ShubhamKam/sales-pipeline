import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Deal } from '@/types';
import { Building2, User, Calendar, Clock, DollarSign, BarChart3 } from 'lucide-react';

interface CustomerDialogProps {
  deal: Deal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDialog({ deal, open, onOpenChange }: CustomerDialogProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{deal.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500">Company Details</h3>
              <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-slate-600" />
                  <span className="text-slate-900 font-medium">{deal.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-slate-600" />
                  <span className="text-slate-900">{deal.contact}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500">Deal Timeline</h3>
              <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="text-sm text-slate-600">Created</p>
                    <p className="text-slate-900">{formatDate(deal.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-slate-600" />
                  <div>
                    <p className="text-sm text-slate-600">Last Updated</p>
                    <p className="text-slate-900">{formatDate(deal.lastUpdated)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500">Financial Details</h3>
              <div className="bg-slate-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-semibold text-green-600">
                    ${deal.value.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-slate-600">Deal Value</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-500">Deal Progress</h3>
              <div className="bg-slate-50 p-4 rounded-lg space-y-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '60%' }} />
                    </div>
                    <p className="text-sm text-slate-600 mt-1">60% Progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}