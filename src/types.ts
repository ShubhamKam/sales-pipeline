export interface Deal {
  id: string;
  title: string;
  value: number;
  company: string;
  contact: string;
  createdAt: string;
  lastUpdated: string;
}

export interface Stage {
  id: string;
  title: string;
  deals: Deal[];
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
}

export interface PipelineStore {
  stages: Stage[];
  isLoading: boolean;
  error: string | null;
  loadDeals: () => Promise<void>;
  addDeal: (stageId: string, deal: Omit<Deal, 'id' | 'createdAt' | 'lastUpdated'>) => void;
  moveDeal: (dealId: string, fromStageId: string, toStageId: string) => void;
  updateDeal: (stageId: string, dealId: string, deal: Partial<Deal>) => void;
  deleteDeal: (stageId: string, dealId: string) => void;
}

export interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}