import Dexie, { type Table } from 'dexie';
import { Deal, User } from '@/types';

export interface DealRecord extends Omit<Deal, 'id'> {
  id?: string;
  stageId: string;
  userId: string;
}

export interface UserRecord extends Omit<User, 'id'> {
  id?: string;
  email: string;
  password: string;
  name: string;
}

export class PipelineDB extends Dexie {
  deals!: Table<DealRecord>;
  users!: Table<UserRecord>;

  constructor() {
    super('pipelineDB');
    
    // Define tables and indexes
    this.version(1).stores({
      deals: '++id, stageId, userId, createdAt, lastUpdated',
      users: '++id, email'
    });

    // Add hooks for type-safety
    this.deals = this.table('deals');
    this.users = this.table('users');
  }
}

// Create and export a single instance
export const db = new PipelineDB();

// Initialize the database
export async function initDatabase() {
  try {
    // Delete the existing database to ensure clean slate
    await Dexie.delete('pipelineDB');
    
    // Create a new instance
    await db.open();
    
    // Create a demo user for testing
    const demoUser = {
      email: 'demo@example.com',
      password: 'demo123',
      name: 'Demo User'
    };

    // Add demo user if it doesn't exist
    const existingUser = await db.users.where('email').equals(demoUser.email).first();
    if (!existingUser) {
      await db.users.add(demoUser);
    }

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}