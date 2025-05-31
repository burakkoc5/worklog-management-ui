export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  gradeId: number;
  gradeName: string;
  teamLeadId: number;
  teamLeadName: string;
  directorId: number;
  directorName: string;
  startDate: string;
  endDate: string | null;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  gradeId: number;
  teamLeadId: number;
  directorId: number;
  startDate: string;
  endDate?: string;
}

export interface UpdateEmployeeDto {
  firstName?: string;
  lastName?: string;
  gradeId?: number;
  teamLeadId?: number;
  directorId?: number;
  startDate?: string;
  endDate?: string;
}

export interface Grade {
  id: number;
  name: string;
}

export interface CreateGradeDto {
  name: string;
}

export interface UpdateGradeDto {
  name: string;
}

export interface WorklogType {
  id: number;
  name: string;
}

export interface CreateWorklogTypeDto {
  name: string;
}

export interface UpdateWorklogTypeDto {
  name: string;
}

export interface Worklog {
  id: number;
  employeeId: number;
  employeeName: string;
  monthDate: string;
  worklogTypeId: number;
  worklogTypeName: string;
  effort: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorklogDto {
  employeeId: number;
  monthDate: string;
  worklogTypeId: number;
  effort: number;
}

export interface UpdateWorklogDto {
  employeeId?: number;
  monthDate?: string;
  worklogTypeId?: number;
  effort?: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
} 