import type { GroupedData, SortOption, WorklogSummary } from '../types/dashboard';

export function getEmployeeRole(employee: any, employees: any[]): 'Employee' | 'Team Lead' | 'Director' {
  // A director is someone who is referenced as a director by other employees
  const isDirector = employees?.some(emp => emp.directorId === employee.id);
  if (isDirector) return 'Director';

  // A team lead is someone who is referenced as a team lead by other employees
  const isTeamLead = employees?.some(emp => emp.teamLeadId === employee.id);
  if (isTeamLead) return 'Team Lead';

  return 'Employee';
}

export function groupByEmployee(employees: any[], filteredWorklogs: any[]): Record<number, GroupedData> {
  return employees?.reduce((acc, employee) => {
    const employeeWorklogs = filteredWorklogs?.filter(w => w.employeeId === employee.id) || [];
    const employeeEffort = employeeWorklogs.reduce((sum, w) => sum + w.effort, 0);
    
    acc[employee.id] = {
      id: employee.id,
      name: `${employee.firstName} ${employee.lastName}`,
      totalEffort: employeeEffort,
      worklogs: employeeWorklogs,
      role: getEmployeeRole(employee, employees),
      gradeName: employee.gradeName,
      endDate: employee.endDate
    };
    return acc;
  }, {} as Record<number, GroupedData>);
}

export function groupByTeamLead(employees: any[], filteredWorklogs: any[]): Record<string | number, GroupedData> {
  return employees?.reduce((acc, employee) => {
    // Skip if employee is a director without a team lead
    if (getEmployeeRole(employee, employees) === 'Director' && !employee.teamLeadId) return acc;

    const employeeWorklogs = filteredWorklogs?.filter(w => w.employeeId === employee.id) || [];
    const employeeEffort = employeeWorklogs.reduce((sum, w) => sum + w.effort, 0);

    // If the employee is a team lead, create or update their own group
    if (getEmployeeRole(employee, employees) === 'Team Lead') {
      const key = employee.id;
      if (!acc[key]) {
        acc[key] = {
          id: key,
          name: `${employee.firstName} ${employee.lastName}`,
          totalEffort: 0,
          worklogs: [],
          children: [],
          leaderEffort: 0,
          leaderWorklogSummary: [],
          gradeName: employee.gradeName,
          endDate: employee.endDate
        };
      }
      
      acc[key].totalEffort += employeeEffort;
      acc[key].leaderEffort = (acc[key].leaderEffort || 0) + employeeEffort;
      
      // Summarize worklogs by type for the team lead
      const worklogSummary = employeeWorklogs.reduce((summaryAcc, worklog) => {
        const existing = summaryAcc.find((item: WorklogSummary) => item.worklogTypeName === worklog.worklogTypeName);
        if (existing) {
          existing.effort += worklog.effort;
        } else {
          summaryAcc.push({ worklogTypeName: worklog.worklogTypeName, effort: worklog.effort });
        }
        return summaryAcc;
      }, [] as WorklogSummary[]);
      acc[key].leaderWorklogSummary = worklogSummary;
    } else { // For non-team leads, group them under their team lead
      const key = employee.teamLeadId || 'unassigned';
      if (!acc[key]) {
        const leader = employees?.find(emp => emp.id === key);
        acc[key] = {
          id: key === 'unassigned' ? -1 : key,
          name: key === 'unassigned' ? 'Team Lead: Unassigned' : 
            `${leader?.firstName || ''} ${leader?.lastName || ''}`,
          totalEffort: 0,
          worklogs: [],
          children: [],
          gradeName: leader?.gradeName,
          endDate: leader?.endDate
        };
      }
      
      acc[key].totalEffort += employeeEffort;
      acc[key].children?.push({
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        totalEffort: employeeEffort,
        worklogs: employeeWorklogs,
        role: getEmployeeRole(employee, employees),
        gradeName: employee.gradeName,
        endDate: employee.endDate
      });
    }
    
    return acc;
  }, {} as Record<string | number, GroupedData>);
}

export function groupByDirector(employees: any[], filteredWorklogs: any[]): Record<string | number, GroupedData> {
  return employees?.reduce((acc, employee) => {
    const employeeWorklogs = filteredWorklogs?.filter(w => w.employeeId === employee.id) || [];
    const employeeEffort = employeeWorklogs.reduce((sum, w) => sum + w.effort, 0);

    // If the employee is a director, create or update their own group
    if (getEmployeeRole(employee, employees) === 'Director') {
      const key = employee.id;
      if (!acc[key]) {
        acc[key] = {
          id: key,
          name: `${employee.firstName} ${employee.lastName}`,
          totalEffort: 0,
          worklogs: [],
          children: [],
          leaderEffort: 0,
          leaderWorklogSummary: [],
          gradeName: employee.gradeName,
          endDate: employee.endDate
        };
      }

      acc[key].totalEffort += employeeEffort;
      acc[key].leaderEffort = (acc[key].leaderEffort || 0) + employeeEffort;
      
      // Summarize worklogs by type for the director
      const worklogSummary = employeeWorklogs.reduce((summaryAcc, worklog) => {
        const existing = summaryAcc.find((item: WorklogSummary) => item.worklogTypeName === worklog.worklogTypeName);
        if (existing) {
          existing.effort += worklog.effort;
        } else {
          summaryAcc.push({ worklogTypeName: worklog.worklogTypeName, effort: worklog.effort });
        }
        return summaryAcc;
      }, [] as WorklogSummary[]);
      acc[key].leaderWorklogSummary = worklogSummary;
    } else { // For non-directors, group them under their director
      const key = employee.directorId || 'unassigned';
      if (!acc[key]) {
        const director = employees?.find(emp => emp.id === key);
        acc[key] = {
          id: key === 'unassigned' ? -1 : key,
          name: key === 'unassigned' ? 'Director: Unassigned' : 
            `${director?.firstName || ''} ${director?.lastName || ''}`,
          totalEffort: 0,
          worklogs: [],
          children: [],
          gradeName: director?.gradeName,
          endDate: director?.endDate
        };
      }
      
      acc[key].totalEffort += employeeEffort;
      acc[key].worklogs.push(...employeeWorklogs);
      acc[key].children?.push({
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        totalEffort: employeeEffort,
        worklogs: employeeWorklogs,
        role: getEmployeeRole(employee, employees),
        gradeName: employee.gradeName,
        endDate: employee.endDate
      });
    }
    
    return acc;
  }, {} as Record<string | number, GroupedData>);
}

export function sortData(data: GroupedData[], sortBy: SortOption): GroupedData[] {
  return [...data].sort((a, b) => {
    switch (sortBy) {
      case 'hours-asc':
        return a.totalEffort - b.totalEffort;
      case 'hours-desc':
        return b.totalEffort - a.totalEffort;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
}

export function filterData(data: GroupedData[], selectedWorklogType: string | null): GroupedData[] {
  if (!selectedWorklogType) return data;
  
  return data.filter(group => {
    // Check if the group itself has matching worklogs
    const hasMatchingWorklogs = group.worklogs?.some(w => w.worklogTypeName === selectedWorklogType);
    
    // Check if any children have matching worklogs
    const childrenHaveMatchingWorklogs = group.children?.some(child => 
      child.worklogs?.some(w => w.worklogTypeName === selectedWorklogType)
    );
    
    return hasMatchingWorklogs || childrenHaveMatchingWorklogs;
  });
} 