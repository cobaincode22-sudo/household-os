import { z } from 'zod';

export type UserRole = 'OWNER' | 'ADMIN' | 'ADULT' | 'TEEN' | 'CHILD' | 'GUEST';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  phone?: string;
  defaultHouseholdId?: string;
  createdAt: string;
}

export interface Household {
  id: string;
  name: string;
  avatarUrl?: string;
  currency: 'IDR' | 'USD' | 'EUR' | 'SGD' | string;
  timezone: string;
  locale: string;
  ownerId: string;
  inviteCode: string;
  createdAt: string;
}

export interface HouseholdMember {
  id: string;
  householdId: string;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  joinedAt: string;
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Task {
  id: string;
  householdId: string;
  title: string;
  description?: string;
  createdBy: string;
  assignedTo?: string; // memberId or userId
  assignedToName?: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  dueDate: string; // ISO string
  recurrence?: 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  estimatedCost?: number;
  actualCost?: number;
  linkedEntityType?: 'ASSET' | 'BILL' | 'MAINTENANCE';
  linkedEntityId?: string;
  completedAt?: string;
  completedBy?: string;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  householdId: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  category: 'FAMILY' | 'SCHOOL' | 'APPOINTMENT' | 'MAINTENANCE' | 'BILL';
  location?: string;
  assignedTo?: string;
  linkedEntityType?: string;
  linkedEntityId?: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE';
export type TransactionVisibility = 'HOUSEHOLD' | 'SPOUSE' | 'PRIVATE';

export interface Transaction {
  id: string;
  householdId: string;
  amount: number; // in smallest unit or direct currency number
  type: TransactionType;
  category: string;
  description: string;
  date: string;
  createdBy: string;
  createdByName?: string;
  visibility: TransactionVisibility;
  linkedTaskId?: string;
  linkedAssetId?: string;
  linkedBillId?: string;
}

export interface Budget {
  id: string;
  householdId: string;
  month: string; // YYYY-MM
  totalBudget: number;
  currency: string;
  spent: number;
}

export interface HouseholdAsset {
  id: string;
  householdId: string;
  name: string;
  category: 'VEHICLE' | 'APPLIANCE' | 'ELECTRONICS' | 'PROPERTY' | 'FURNITURE' | 'OTHER';
  brand?: string;
  model?: string;
  serialNumber?: string;
  plateNumber?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  warrantyExpiration?: string;
  taxDueDate?: string;
  nextServiceDate?: string;
  nextServiceMileage?: number;
  currentMileage?: number;
  location?: string;
  notes?: string;
  photos?: string[];
}

export interface MaintenanceRecord {
  id: string;
  householdId: string;
  assetId: string;
  assetName: string;
  title: string;
  date: string;
  cost: number;
  provider?: string;
  notes?: string;
  nextMaintenanceDate?: string;
  nextMaintenanceUsage?: number;
}

export interface Bill {
  id: string;
  householdId: string;
  name: string;
  amount: number;
  frequency: 'MONTHLY' | 'ANNUALLY' | 'WEEKLY' | 'CUSTOM';
  dueDay: number; // e.g., 25 for 25th of month
  nextDueDate: string;
  category: string;
  assignedTo?: string;
  assignedToName?: string;
  autoCreateTask: boolean;
  status: 'ACTIVE' | 'PAUSED';
}

export interface DiaryEntry {
  id: string;
  householdId: string;
  title: string;
  date: string;
  description: string;
  photos: string[];
  participants: string[];
  location?: string;
  tags?: string[];
}

export type TimelineEventType = 
  | 'TASK_COMPLETED' 
  | 'BILL_PAID' 
  | 'EXPENSE' 
  | 'INCOME' 
  | 'MAINTENANCE' 
  | 'ASSET_ADDED' 
  | 'DIARY' 
  | 'EVENT' 
  | 'MEMBER_JOINED';

export interface TimelineEvent {
  id: string;
  householdId: string;
  eventType: TimelineEventType;
  title: string;
  summary: string;
  actorName: string;
  amount?: number;
  occurredAt: string;
  refId?: string;
  refCollection?: string;
}
