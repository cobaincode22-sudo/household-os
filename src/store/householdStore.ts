import { create } from 'zustand';
import { 
  User, 
  Household, 
  HouseholdMember, 
  Task, 
  TaskStatus,
  CalendarEvent, 
  Transaction, 
  Budget, 
  HouseholdAsset, 
  MaintenanceRecord, 
  Bill, 
  DiaryEntry, 
  TimelineEvent, 
  UserRole 
} from '../types/household';

interface HouseholdState {
  currentUser: User | null;
  currentHousehold: Household | null;
  members: HouseholdMember[];
  userRole: UserRole;
  tasks: Task[];
  events: CalendarEvent[];
  transactions: Transaction[];
  currentBudget: Budget | null;
  assets: HouseholdAsset[];
  maintenanceRecords: MaintenanceRecord[];
  bills: Bill[];
  diaryEntries: DiaryEntry[];
  timelineEvents: TimelineEvent[];

  // Tab navigation helper
  activeMoreTab: 'FINANCE' | 'BILLS' | 'ASSETS' | 'DIARY' | 'TIMELINE';
  setActiveMoreTab: (tab: 'FINANCE' | 'BILLS' | 'ASSETS' | 'DIARY' | 'TIMELINE') => void;

  // Actions
  setCurrentUser: (user: User | null) => void;
  setCurrentHousehold: (household: Household | null) => void;
  setUserRole: (role: UserRole) => void;
  
  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  toggleTaskStatus: (taskId: string) => void;
  
  // Event Actions
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;

  // Bill Actions
  addBill: (bill: Omit<Bill, 'id'>) => void;
  payBill: (billId: string, amount: number, payerName: string) => void;
  
  // Asset & Maintenance Actions
  addAsset: (asset: Omit<HouseholdAsset, 'id'>) => void;
  addMaintenance: (record: Omit<MaintenanceRecord, 'id'>) => void;
  
  // Finance Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  
  // Diary Actions
  addDiaryEntry: (entry: Omit<DiaryEntry, 'id'>) => void;
  
  // Timeline Actions
  addTimelineEvent: (event: Omit<TimelineEvent, 'id' | 'occurredAt'>) => void;
}

export const useHouseholdStore = create<HouseholdState>((set, get) => ({
  currentUser: {
    id: 'user_1',
    name: 'Dad (Papa)',
    email: 'dad@household.family',
    createdAt: new Date().toISOString(),
  },
  currentHousehold: {
    id: 'hh_anderson',
    name: 'The Anderson Family',
    currency: 'Rp',
    timezone: 'Asia/Jakarta',
    locale: 'id-ID',
    ownerId: 'user_1',
    inviteCode: 'FAM-7782',
    createdAt: new Date().toISOString(),
  },
  userRole: 'OWNER',
  members: [
    {
      id: 'm_1',
      householdId: 'hh_anderson',
      userId: 'user_1',
      name: 'Dad',
      email: 'dad@household.family',
      role: 'OWNER',
      joinedAt: '2024-01-01',
    },
    {
      id: 'm_2',
      householdId: 'hh_anderson',
      userId: 'user_2',
      name: 'Mom',
      email: 'mom@household.family',
      role: 'ADMIN',
      joinedAt: '2024-01-01',
    },
    {
      id: 'm_3',
      householdId: 'hh_anderson',
      userId: 'user_3',
      name: 'Alex',
      email: 'alex@household.family',
      role: 'TEEN',
      joinedAt: '2024-01-01',
    }
  ],
  tasks: [
    {
      id: 'task_1',
      householdId: 'hh_anderson',
      title: 'Buy groceries for dinner',
      description: 'Vegetables, milk, eggs, olive oil, and fruit',
      createdBy: 'user_2',
      assignedTo: 'm_2',
      assignedToName: 'Mom',
      status: 'TODO',
      priority: 'HIGH',
      category: 'Food',
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task_2',
      householdId: 'hh_anderson',
      title: 'Take car for regular service',
      description: '70,000 km oil check at Auto2000',
      createdBy: 'user_1',
      assignedTo: 'm_1',
      assignedToName: 'Dad',
      status: 'TODO',
      priority: 'MEDIUM',
      category: 'Vehicle',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      linkedEntityType: 'ASSET',
      linkedEntityId: 'asset_fortuner',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'task_3',
      householdId: 'hh_anderson',
      title: 'Finish science project homework',
      description: 'Solar system model due tomorrow morning',
      createdBy: 'user_1',
      assignedTo: 'm_3',
      assignedToName: 'Alex',
      status: 'TODO',
      priority: 'HIGH',
      category: 'Education',
      dueDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
  ],
  events: [
    {
      id: 'ev_1',
      householdId: 'hh_anderson',
      title: 'Toyota Fortuner Service',
      description: 'Scheduled maintenance check at Auto2000',
      startDate: new Date(Date.now() + 86400000).toISOString(),
      endDate: new Date(Date.now() + 90000000).toISOString(),
      allDay: false,
      category: 'MAINTENANCE',
      location: 'Auto2000 Workshop',
      linkedEntityType: 'ASSET',
      linkedEntityId: 'asset_fortuner',
    },
    {
      id: 'ev_2',
      householdId: 'hh_anderson',
      title: 'Alex School Parent-Teacher Meeting',
      startDate: new Date(Date.now() + 172800000).toISOString(),
      endDate: new Date(Date.now() + 180000000).toISOString(),
      allDay: false,
      category: 'SCHOOL',
      location: 'Elementary School Hall',
    }
  ],
  transactions: [
    {
      id: 'tx_1',
      householdId: 'hh_anderson',
      amount: 2430000,
      type: 'EXPENSE',
      category: 'Food',
      description: 'Monthly Groceries & Household supplies',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      createdBy: 'user_2',
      createdByName: 'Mom',
      visibility: 'HOUSEHOLD',
    },
    {
      id: 'tx_2',
      householdId: 'hh_anderson',
      amount: 1850000,
      type: 'EXPENSE',
      category: 'Transportation',
      description: 'Toyota Periodic Maintenance & Oil filter',
      date: new Date(Date.now() - 86400000 * 3).toISOString(),
      createdBy: 'user_1',
      createdByName: 'Dad',
      visibility: 'HOUSEHOLD',
      linkedAssetId: 'asset_fortuner',
    }
  ],
  currentBudget: {
    id: 'b_current',
    householdId: 'hh_anderson',
    month: 'September',
    totalBudget: 20000000,
    spent: 12300000,
    currency: 'Rp',
  },
  assets: [
    {
      id: 'asset_fortuner',
      householdId: 'hh_anderson',
      name: 'Toyota Fortuner',
      category: 'VEHICLE',
      brand: 'Toyota',
      model: 'VRZ 2.8',
      plateNumber: 'B 1234 PA',
      purchaseDate: '2024-02-14',
      taxDueDate: '2027-02-14',
      nextServiceMileage: 72000,
      currentMileage: 70450,
      notes: 'Main family car. Registered under Dad.',
    },
    {
      id: 'asset_ac',
      householdId: 'hh_anderson',
      name: 'Master Bedroom AC',
      category: 'APPLIANCE',
      brand: 'Daikin',
      model: 'Inverter 1.5 PK',
      location: 'Master Bedroom',
      notes: 'Routine cleaning scheduled every 6 months.',
    }
  ],
  maintenanceRecords: [
    {
      id: 'maint_1',
      householdId: 'hh_anderson',
      assetId: 'asset_fortuner',
      assetName: 'Toyota Fortuner',
      title: '70,000 km Service',
      date: '2026-09-22',
      cost: 1850000,
      provider: 'Auto2000',
      notes: 'Full synthetic oil replacement and brake inspection.',
      nextMaintenanceUsage: 80000,
    }
  ],
  bills: [
    {
      id: 'bill_internet',
      householdId: 'hh_anderson',
      name: 'IndiHome Fiber Internet',
      amount: 650000,
      frequency: 'MONTHLY',
      dueDay: 25,
      nextDueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
      category: 'Utilities',
      assignedTo: 'm_1',
      assignedToName: 'Dad',
      autoCreateTask: true,
      status: 'ACTIVE',
    },
    {
      id: 'bill_tax',
      householdId: 'hh_anderson',
      name: 'Car Annual Tax (PKB)',
      amount: 8500000,
      frequency: 'ANNUALLY',
      dueDay: 14,
      nextDueDate: new Date(Date.now() + 86400000 * 12).toISOString(),
      category: 'Transportation',
      assignedTo: 'm_1',
      assignedToName: 'Dad',
      autoCreateTask: true,
      status: 'ACTIVE',
    },
    {
      id: 'bill_school',
      householdId: 'hh_anderson',
      name: 'School Tuition (SPP)',
      amount: 3200000,
      frequency: 'MONTHLY',
      dueDay: 10,
      nextDueDate: new Date(Date.now() + 86400000 * 15).toISOString(),
      category: 'Education',
      assignedTo: 'm_2',
      assignedToName: 'Mom',
      autoCreateTask: true,
      status: 'ACTIVE',
    }
  ],
  diaryEntries: [
    {
      id: 'diary_1',
      householdId: 'hh_anderson',
      title: 'Family Dinner at Riverside',
      date: '2026-09-21',
      description: 'Celebrated Alex receiving an award for the school math olympiad.',
      photos: [],
      participants: ['Dad', 'Mom', 'Alex'],
      location: 'Riverside Bistro',
      tags: ['Family', 'Celebration'],
    }
  ],
  timelineEvents: [
    {
      id: 'tl_1',
      householdId: 'hh_anderson',
      eventType: 'BILL_PAID',
      title: 'Internet Bill Paid',
      summary: 'IndiHome Fiber 100 Mbps paid by Dad',
      actorName: 'Dad',
      amount: 650000,
      occurredAt: '2026-09-23T10:15:00.000Z',
    },
    {
      id: 'tl_2',
      householdId: 'hh_anderson',
      eventType: 'MAINTENANCE',
      title: 'Toyota Fortuner Serviced',
      summary: '70,000 km maintenance at Auto2000',
      actorName: 'Dad',
      amount: 1850000,
      occurredAt: '2026-09-22T14:30:00.000Z',
    },
    {
      id: 'tl_3',
      householdId: 'hh_anderson',
      eventType: 'DIARY',
      title: 'Family Dinner',
      summary: 'Celebration dinner at Riverside Bistro',
      actorName: 'Mom',
      occurredAt: '2026-09-21T19:00:00.000Z',
    },
    {
      id: 'tl_4',
      householdId: 'hh_anderson',
      eventType: 'EXPENSE',
      title: 'Monthly Groceries',
      summary: 'Pantry restocking for the week',
      actorName: 'Mom',
      amount: 2430000,
      occurredAt: '2026-09-20T11:20:00.000Z',
    }
  ],
  activeMoreTab: 'FINANCE',
  setActiveMoreTab: (tab) => set({ activeMoreTab: tab }),

  setCurrentUser: (user) => set({ currentUser: user }),
  setCurrentHousehold: (household) => set({ currentHousehold: household }),
  setUserRole: (role) => set({ userRole: role }),

  addEvent: (eventData) => {
    const newEv: CalendarEvent = {
      ...eventData,
      id: `ev_${Date.now()}`,
    };
    set((state) => ({ events: [...state.events, newEv] }));
  },

  addTask: (taskData) => {
    const newTask: Task = {
      ...taskData,
      id: `task_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },

  toggleTaskStatus: (taskId) => {
    const { tasks, addTimelineEvent } = get();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const isCompleting = task.status !== 'COMPLETED';
    const updatedStatus: TaskStatus = isCompleting ? 'COMPLETED' : 'TODO';

    set((state) => ({
      tasks: state.tasks.map((t) => 
        t.id === taskId 
          ? { ...t, status: updatedStatus, completedAt: isCompleting ? new Date().toISOString() : undefined }
          : t
      )
    }));

    if (isCompleting) {
      addTimelineEvent({
        householdId: task.householdId,
        eventType: 'TASK_COMPLETED',
        title: `Task Completed: ${task.title}`,
        summary: `Completed by ${task.assignedToName || 'Member'}`,
        actorName: task.assignedToName || 'Member',
        refId: task.id,
        refCollection: 'tasks',
      });
    }
  },

  addBill: (billData) => {
    const newBill: Bill = {
      ...billData,
      id: `bill_${Date.now()}`,
    };
    set((state) => ({ bills: [...state.bills, newBill] }));
  },

  payBill: (billId, amount, payerName) => {
    const bill = get().bills.find(b => b.id === billId);
    if (!bill) return;

    // 1. Add transaction expense
    const tx: Omit<Transaction, 'id'> = {
      householdId: bill.householdId,
      amount,
      type: 'EXPENSE',
      category: bill.category || 'Utilities',
      description: `Bill Payment: ${bill.name}`,
      date: new Date().toISOString(),
      createdBy: 'current_user',
      createdByName: payerName,
      visibility: 'HOUSEHOLD',
      linkedBillId: bill.id,
    };
    get().addTransaction(tx);

    // 2. Add Timeline event
    get().addTimelineEvent({
      householdId: bill.householdId,
      eventType: 'BILL_PAID',
      title: `${bill.name} Paid`,
      summary: `Amount: Rp${amount.toLocaleString()} paid by ${payerName}`,
      actorName: payerName,
      amount,
      refId: bill.id,
      refCollection: 'bills',
    });
  },

  addAsset: (assetData) => {
    const newAsset: HouseholdAsset = {
      ...assetData,
      id: `asset_${Date.now()}`,
    };
    set((state) => ({ assets: [newAsset, ...state.assets] }));
    get().addTimelineEvent({
      householdId: newAsset.householdId,
      eventType: 'ASSET_ADDED',
      title: `New Asset Added: ${newAsset.name}`,
      summary: `${newAsset.category} (${newAsset.brand || ''} ${newAsset.model || ''})`,
      actorName: 'Family Member',
      refId: newAsset.id,
      refCollection: 'assets',
    });
  },

  addMaintenance: (recordData) => {
    const newMaint: MaintenanceRecord = {
      ...recordData,
      id: `maint_${Date.now()}`,
    };
    set((state) => ({ maintenanceRecords: [newMaint, ...state.maintenanceRecords] }));
    
    // Add linked expense
    if (newMaint.cost > 0) {
      get().addTransaction({
        householdId: newMaint.householdId,
        amount: newMaint.cost,
        type: 'EXPENSE',
        category: 'Maintenance',
        description: `${newMaint.assetName} Service: ${newMaint.title}`,
        date: newMaint.date,
        createdBy: 'current_user',
        createdByName: 'Dad',
        visibility: 'HOUSEHOLD',
        linkedAssetId: newMaint.assetId,
      });
    }

    get().addTimelineEvent({
      householdId: newMaint.householdId,
      eventType: 'MAINTENANCE',
      title: `${newMaint.assetName} Serviced`,
      summary: `${newMaint.title} at ${newMaint.provider || 'Service Center'}`,
      actorName: 'Dad',
      amount: newMaint.cost,
      refId: newMaint.id,
      refCollection: 'maintenance',
    });
  },

  addTransaction: (txData) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx_${Date.now()}`,
    };
    set((state) => {
      const updatedSpent = state.currentBudget 
        ? state.currentBudget.spent + (txData.type === 'EXPENSE' ? txData.amount : 0)
        : 0;

      return {
        transactions: [newTx, ...state.transactions],
        currentBudget: state.currentBudget 
          ? { ...state.currentBudget, spent: updatedSpent }
          : null,
      };
    });
  },

  addDiaryEntry: (entryData) => {
    const newEntry: DiaryEntry = {
      ...entryData,
      id: `diary_${Date.now()}`,
    };
    set((state) => ({ diaryEntries: [newEntry, ...state.diaryEntries] }));
    get().addTimelineEvent({
      householdId: newEntry.householdId,
      eventType: 'DIARY',
      title: newEntry.title,
      summary: newEntry.description.slice(0, 80) + '...',
      actorName: 'Family',
      refId: newEntry.id,
      refCollection: 'diary',
    });
  },

  addTimelineEvent: (eventData) => {
    const newEvent: TimelineEvent = {
      ...eventData,
      id: `tl_${Date.now()}`,
      occurredAt: new Date().toISOString(),
    };
    set((state) => ({ timelineEvents: [newEvent, ...state.timelineEvents] }));
  }
}));
