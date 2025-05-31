export type WorklogSummary = {
  worklogTypeName: string;
  effort: number;
};

export type GroupedData = {
  id: number;
  name: string;
  totalEffort: number;
  worklogs: any[];
  children?: GroupedData[];
  role?: 'Employee' | 'Team Lead' | 'Director';
  leaderEffort?: number;
  leaderWorklogSummary?: WorklogSummary[];
  gradeName?: string;
  endDate?: string | null;
};

export type SortOption = 'hours-asc' | 'hours-desc' | 'name-asc' | 'name-desc';

export type WorklogEntriesSortOption = SortOption | 'createdAt-asc' | 'createdAt-desc' | 'updatedAt-asc' | 'updatedAt-desc';

export interface WorklogTypeResponse {
  content: { name: string }[];
} 