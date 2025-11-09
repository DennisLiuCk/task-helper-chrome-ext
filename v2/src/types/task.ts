export type TaskStatus = 'NA' | 'DEV' | 'QA' | 'UAT' | 'DONE' | 'BLOCKED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Task {
  id: string; // MS-1234
  prefix: string; // MS-
  number: number; // 1234
  title?: string;
  status: TaskStatus;
  service: string;
  priority?: Priority;
  tags?: string[];
  slackLink?: string;
  confluenceLink?: string;
  assignee?: string;
  createdAt: number;
  updatedAt: number;
  completedAt?: number;
  isPinned: boolean;
  isStarred: boolean;
  notes?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface TaskFilter {
  status?: TaskStatus[];
  service?: string[];
  priority?: Priority[];
  tags?: string[];
  search?: string;
  isPinned?: boolean;
  isStarred?: boolean;
}

export interface TaskStats {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byService: Record<string, number>;
  byPriority: Record<Priority, number>;
}
