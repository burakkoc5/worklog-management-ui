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
};

export type SortOption = 'hours-asc' | 'hours-desc' | 'name-asc' | 'name-desc';

export interface WorklogTypeResponse {
  content: { name: string }[];
} 