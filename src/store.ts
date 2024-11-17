import { create } from 'zustand';
import { PipelineStore, Deal, Stage } from './types';
import { db } from './lib/db';
import type { DealRecord } from './lib/db';
import { useAuthStore } from './store/auth';

const initialStages: Stage[] = [
  { id: 'lead', title: 'Lead', deals: [] },
  { id: 'contact', title: 'Contact Made', deals: [] },
  { id: 'proposal', title: 'Proposal', deals: [] },
  { id: 'negotiation', title: 'Negotiation', deals: [] },
  { id: 'closed', title: 'Closed Won', deals: [] },
];

export const usePipelineStore = create<PipelineStore>((set, get) => ({
  stages: initialStages,
  isLoading: true,
  error: null,

  loadDeals: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      const deals = await db.deals.where('userId').equals(user.id).toArray();
      
      const stages = initialStages.map(stage => ({
        ...stage,
        deals: deals
          .filter(deal => deal.stageId === stage.id)
          .map(deal => ({
            id: deal.id!,
            title: deal.title,
            value: deal.value,
            company: deal.company,
            contact: deal.contact,
            createdAt: deal.createdAt,
            lastUpdated: deal.lastUpdated,
          })),
      }));

      set({ stages, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  addDeal: async (stageId, dealData) => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    const newDeal: DealRecord = {
      ...dealData,
      stageId,
      userId: user.id,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };
    
    try {
      const id = await db.deals.add(newDeal);
      const deal: Deal = { ...dealData, id: id.toString(), createdAt: newDeal.createdAt, lastUpdated: newDeal.lastUpdated };

      set((state) => ({
        stages: state.stages.map((stage) =>
          stage.id === stageId
            ? { ...stage, deals: [...stage.deals, deal] }
            : stage
        ),
      }));
    } catch (error) {
      console.error('Failed to add deal:', error);
    }
  },

  moveDeal: async (dealId, fromStageId, toStageId) => {
    const fromStage = get().stages.find((s) => s.id === fromStageId);
    const deal = fromStage?.deals.find((d) => d.id === dealId);
    
    if (!deal) return;

    const updatedDeal = {
      ...deal,
      lastUpdated: new Date().toISOString(),
    };

    try {
      await db.deals.where('id').equals(dealId).modify({ 
        stageId: toStageId,
        lastUpdated: updatedDeal.lastUpdated 
      });

      set((state) => ({
        stages: state.stages.map((stage) => {
          if (stage.id === fromStageId) {
            return {
              ...stage,
              deals: stage.deals.filter((d) => d.id !== dealId),
            };
          }
          if (stage.id === toStageId) {
            return {
              ...stage,
              deals: [...stage.deals, updatedDeal],
            };
          }
          return stage;
        }),
      }));
    } catch (error) {
      console.error('Failed to move deal:', error);
    }
  },

  updateDeal: async (stageId, dealId, updatedFields) => {
    try {
      const lastUpdated = new Date().toISOString();
      
      await db.deals.where('id').equals(dealId).modify({
        ...updatedFields,
        lastUpdated,
      });

      set((state) => ({
        stages: state.stages.map((stage) =>
          stage.id === stageId
            ? {
                ...stage,
                deals: stage.deals.map((deal) =>
                  deal.id === dealId
                    ? {
                        ...deal,
                        ...updatedFields,
                        lastUpdated,
                      }
                    : deal
                ),
              }
            : stage
        ),
      }));
    } catch (error) {
      console.error('Failed to update deal:', error);
    }
  },

  deleteDeal: async (stageId, dealId) => {
    try {
      await db.deals.where('id').equals(dealId).delete();

      set((state) => ({
        stages: state.stages.map((stage) =>
          stage.id === stageId
            ? {
                ...stage,
                deals: stage.deals.filter((deal) => deal.id !== dealId),
              }
            : stage
        ),
      }));
    } catch (error) {
      console.error('Failed to delete deal:', error);
    }
  },
}));