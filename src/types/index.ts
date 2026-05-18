// Task categories
export type TaskCategory = 'work' | 'home' | 'personal' | 'side-project';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

// Goal types
export type GoalLevel = 'annual' | 'seasonal' | 'monthly' | 'weekly';
export type GoalStatus = 'active' | 'completed' | 'abandoned';
export type Season = 'winter' | 'spring' | 'summer' | 'fall' | 'holidays';
export type GoalCategory = 'home' | 'personal' | 'career' | 'side-project';

// Subtask type
export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  completed: number; // SQLite uses 0/1 for boolean
  sortOrder: number;
  createdAt: string;
  completedAt?: string | null;
}

// Subtask summary for batch queries
export interface SubtaskSummary {
  total: number;
  completed: number;
}

// Core task type (local SQLite)
export interface Task {
  id: string;
  title: string;
  notes?: string;
  link?: string;
  category: TaskCategory;
  status: TaskStatus;
  dueDate?: string;
  isSyncPriority: boolean;
  sortOrder: number;
  createdAt: string;
  completedAt?: string;
  source: 'local' | 'notion';
  notionId?: string;
}

// Meeting source types
export type MeetingSource = 'local' | 'workiq';

// Meeting (manual entry or synced from calendar)
export interface Meeting {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  time: string; // Time string (HH:MM)
  title: string;
  category: TaskCategory;
  done: boolean;
  notes?: string;
  link?: string; // Meeting link (Zoom, Teams, etc.)
  source?: MeetingSource; // Where the meeting came from
  externalId?: string; // External ID for synced meetings
}

// Blocked meeting pattern for filtering calendar sync
export interface BlockedMeetingPattern {
  id: string;
  pattern: string;
  isRegex: boolean;
  createdAt: string;
}

// For creating meetings with contacts
export interface CreateMeetingInput {
  title: string;
  date: string;
  time: string;
  category: TaskCategory;
  notes?: string;
  link?: string;
}

// For updating meetings
export interface UpdateMeetingInput {
  title?: string;
  date?: string;
  time?: string;
  category?: TaskCategory;
  notes?: string;
  done?: boolean;
}

// Daily log for tracking
export interface DailyLog {
  id: string;
  date: string;
  syncPriorityId?: string;
  morningIntention?: string;
  eveningReflection?: string;
  meetings: string; // Markdown checklist
  energyLevel?: 1 | 2 | 3 | 4 | 5;
  
  // Morning ritual fields
  morningRitualCompleted?: boolean;
  morningRitualTime?: string;
  intention?: string;
  
  // Evening ritual fields
  eveningRitualCompleted?: boolean;
  eveningRitualTime?: string;
  reflection?: string;
  gratitude?: string;
  untrackedWins?: string;
  
  // Daily stats
  tasksCompleted?: number;
  tasksCreated?: number;
  focusAchieved?: boolean;
  
  updatedAt?: string;
}

// Streak types
export type StreakType = 'morning_ritual' | 'evening_ritual' | 'focus' | 'full_day';

export interface Streak {
  id: string;
  streakType: StreakType;
  currentCount: number;
  bestCount: number;
  lastDate: string;
  updatedAt: string;
}

// Weekly metrics
export interface WeeklyMetrics {
  id: string;
  year: number;
  week: number;
  tasksCompleted: number;
  focusDays: number;
  morningRituals: number;
  eveningRituals: number;
  avgEnergy: number | null;
  githubCommits: number;
  githubPrsOpened: number;
  githubPrsMerged: number;
  githubIssuesClosed: number;
  createdAt: string;
  updatedAt: string;
}

// Ritual step definitions
export interface RitualStep {
  id: string;
  title: string;
  description: string;
  durationSeconds?: number;
  component?: 'breathing' | 'text-input' | 'task-review' | 'checkbox' | 'reflection';
}

export const MORNING_RITUAL_STEPS: RitualStep[] = [
  {
    id: 'breathe',
    title: 'Breathe',
    description: 'Center yourself with 4-7-8 breathing',
    durationSeconds: 60,
    component: 'breathing',
  },
  {
    id: 'review',
    title: 'Review',
    description: 'Review your main priority and today\'s tasks',
    component: 'task-review',
  },
  {
    id: 'intention',
    title: 'Intention',
    description: 'Set your intention for today',
    component: 'text-input',
  },
  {
    id: 'focus',
    title: 'Focus',
    description: 'Commit to protecting your focus time',
    component: 'checkbox',
  },
];

// Contact
export interface Contact {
  id: string
  name: string
  checkInFrequency?: string
  contactMethod?: string
  knownFor?: string
  nextCheckIn?: string
  lastCheckIn?: string
  notes?: string
  company?: string
  email?: string
  phone?: string
  birthday?: string
  notionId?: string
}

export interface UpdateContactInput {
  name?: string
  company?: string
  knownFor?: string
  contactMethod?: string
  email?: string
  phone?: string
  birthday?: string
  checkInFrequency?: string
  notes?: string
}

// Goals
export interface Goal {
  id: string
  title: string
  description?: string
  level: GoalLevel
  category: GoalCategory
  status: GoalStatus
  progress?: number
  parentId?: string | null
  year?: number
  season?: Season
  month?: number
  week?: number
  dueDate?: string
  createdAt: string
  updatedAt?: string
}

export interface GoalWithHierarchy extends Goal {
  children: GoalWithHierarchy[]
  ancestors: GoalWithHierarchy[]
  depth?: number
}

export interface TimePeriod {
  level: GoalLevel
  year: number
  season?: Season
  month?: number
  week?: number
  label: string
  shortLabel?: string
  isCurrent?: boolean
  startDate: Date
  endDate: Date
}

export interface CreateGoalInput {
  title: string
  description?: string
  level: GoalLevel
  category: GoalCategory
  parentId?: string | null
  year?: number
  season?: Season
  month?: number
  week?: number
  dueDate?: string
}

export interface UpdateGoalInput {
  title?: string
  description?: string
  level?: GoalLevel
  category?: GoalCategory
  status?: GoalStatus
  progress?: number
  parentId?: string | null
  year?: number
  season?: Season
  month?: number
  week?: number
  dueDate?: string
}

export interface GoalFilters {
  status?: GoalStatus
  category?: GoalCategory
}

// Inbox
export type InboxSource = 'notion' | 'local' | 'extension'
export type InboxStatus = 'pending' | 'done' | 'dismissed' | 'deferred'

export interface InboxItem {
  id: string
  title: string
  description?: string
  source: InboxSource
  status: InboxStatus
  createdAt: string
  deferredUntil?: string
  routedTo?: string
  routedType?: 'task' | 'goal' | 'writing' | 'reading'
  notionId?: string
}

export const EVENING_RITUAL_STEPS: RitualStep[] = [
  {
    id: 'wins',
    title: 'Wins',
    description: 'Capture any untracked wins from today',
    component: 'text-input',
  },
  {
    id: 'reflect',
    title: 'Reflect',
    description: 'What went well? What could improve?',
    component: 'reflection',
  },
  {
    id: 'gratitude',
    title: 'Gratitude',
    description: 'One thing you\'re grateful for today',
    component: 'text-input',
  },
  {
    id: 'tomorrow',
    title: 'Tomorrow',
    description: 'Quick preview of tomorrow\'s main priority',
    component: 'task-review',
  },
];

