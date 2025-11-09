export type ReleaseStatus = 'PLANNING' | 'IN_PROGRESS' | 'TESTING' | 'RELEASED';

export interface ReleaseGroup {
  id: string;
  name: string;
  date: string; // YYYY-MM-DD
  description?: string;
  tasks: string[]; // Task IDs
  status: ReleaseStatus;
  createdAt: number;
  updatedAt: number;
  createdBy?: string;
  tags?: string[];
  isArchived: boolean;
}

export interface ReleaseStats {
  total: number;
  byStatus: Record<ReleaseStatus, number>;
  tasksPerRelease: number;
}
