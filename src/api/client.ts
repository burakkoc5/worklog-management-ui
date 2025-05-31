import type { Page, Worklog, CreateWorklogDto, UpdateWorklogDto, Employee, Grade, WorklogType, CreateEmployeeDto, CreateGradeDto, CreateWorklogTypeDto } from '../types';
import type { SortOption, WorklogEntriesSortOption } from '../types/dashboard';
import { createThrottledAxiosInstance } from '../utils/requestThrottle';

const api = createThrottledAxiosInstance();
api.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
api.defaults.headers.common['Content-Type'] = 'application/json';

const getSortField = (sortBy: SortOption | WorklogEntriesSortOption): string => {
  switch (sortBy) {
    case 'hours-asc':
    case 'hours-desc':
      return 'effort';
    case 'name-asc':
    case 'name-desc':
      return 'employeeName';
    case 'createdAt-asc':
    case 'createdAt-desc':
      return 'createdAt';
    case 'updatedAt-asc':
    case 'updatedAt-desc':
      return 'updatedAt';
    default:
      return 'effort';
  }
};

export const worklogApi = {
  getAll: (
    page: number,
    size: number,
    sortBy: WorklogEntriesSortOption | null = null,
    sortDirection: 'asc' | 'desc' | null = null
  ) => 
    api.get<Page<Worklog>>(
      `/worklogs?page=${page}&size=${size}${sortBy ? `&sortBy=${getSortField(sortBy)}` : ''}${sortDirection ? `&sortDirection=${sortDirection}` : ''}`
    ),
  
  getByEmployeeId: (
    employeeId: number,
    page: number,
    size: number,
    sortBy: WorklogEntriesSortOption,
    sortDirection: 'asc' | 'desc'
  ) =>
    api.get<Page<Worklog>>(
      `/worklogs/employee/${employeeId}?page=${page}&size=${size}&sortBy=${getSortField(sortBy)}&sortDirection=${sortDirection}`
    ),

  getById: (id: number) => 
    api.get<Worklog>(`/worklogs/${id}`),
  
  create: (data: CreateWorklogDto) => 
    api.post<Worklog>('/worklogs', data),
  
  update: (id: number, data: UpdateWorklogDto) => 
    api.put<Worklog>(`/worklogs/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/worklogs/${id}`),
};

export const employeeApi = {
  getAll: (page: number, size: number) => 
    api.get<Page<Employee>>(`/employees?page=${page}&size=${size}`),
  
  getById: (id: number) => 
    api.get<Employee>(`/employees/${id}`),
  
  create: (data: CreateEmployeeDto) => 
    api.post<Employee>('/employees', data),
  
  update: (id: number, data: Partial<Employee>) => 
    api.put<Employee>(`/employees/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/employees/${id}`),
};

export const gradeApi = {
  getAll: (page = 0, size = 10) => 
    api.get<Page<Grade>>('/grades', { params: { page, size } }),
  
  getById: (id: number) => 
    api.get<Grade>(`/grades/${id}`),
  
  create: (data: CreateGradeDto) => 
    api.post<Grade>('/grades', data),
  
  update: (id: number, data: Partial<Grade>) => 
    api.put<Grade>(`/grades/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/grades/${id}`),
};

export const worklogTypeApi = {
  getAll: (page: number, size: number) => 
    api.get<Page<WorklogType>>(`/worklog-types?page=${page}&size=${size}`),
  
  getById: (id: number) => 
    api.get<WorklogType>(`/worklog-types/${id}`),
  
  create: (data: CreateWorklogTypeDto) => 
    api.post<WorklogType>('/worklog-types', data),
  
  update: (id: number, data: Partial<WorklogType>) => 
    api.put<WorklogType>(`/worklog-types/${id}`, data),
  
  delete: (id: number) => 
    api.delete(`/worklog-types/${id}`),
}; 