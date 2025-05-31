import { format } from 'date-fns';

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#dd1e1'];

export interface WorklogWithEmployeeData {
  employeeName: string;
  effort: number;
  worklogTypeName: string;
  monthDate: string;
  gradeName?: string;
  teamLeadName?: string;
  directorName?: string;
}

export const calculateEffortByRole = (worklogsWithEmployeeData: WorklogWithEmployeeData[]) => {
  return worklogsWithEmployeeData.reduce((acc: any[], worklog) => {
    if (!worklog.gradeName) return acc;

    const existingRole = acc.find(item => item.role === worklog.gradeName);
    if (existingRole) {
      existingRole.effort += worklog.effort;
      existingRole.count += 1;
    } else {
      acc.push({ role: worklog.gradeName, effort: worklog.effort, count: 1 });
    }
    return acc;
  }, []).map(roleData => ({
    role: roleData.role,
    averageEffort: roleData.effort / roleData.count,
  }));
};

export const calculateWorklogTypeDistributionPerEmployee = (
  worklogsWithEmployeeData: WorklogWithEmployeeData[],
  uniqueWorklogTypes: string[]
) => {
  return worklogsWithEmployeeData.reduce((acc: any[], worklog) => {
    const existingEmployee = acc.find(item => item.name === worklog.employeeName);
    if (existingEmployee) {
      existingEmployee[worklog.worklogTypeName] = (existingEmployee[worklog.worklogTypeName] || 0) + worklog.effort;
    } else {
      acc.push({ name: worklog.employeeName, [worklog.worklogTypeName]: worklog.effort });
    }
    return acc;
  }, []).sort((a, b) => {
    const totalEffortA = uniqueWorklogTypes.reduce((sum, type) => sum + (a[type] || 0), 0);
    const totalEffortB = uniqueWorklogTypes.reduce((sum, type) => sum + (b[type] || 0), 0);
    return totalEffortB - totalEffortA;
  });
};

export const calculateEffortByTeamLead = (worklogsWithEmployeeData: WorklogWithEmployeeData[]) => {
  return worklogsWithEmployeeData.reduce((acc: any[], worklog) => {
    if (!worklog.teamLeadName) return acc;

    const existingTeamLead = acc.find(item => item.name === worklog.teamLeadName);
    if (existingTeamLead) {
      existingTeamLead.effort += worklog.effort;
    } else {
      acc.push({ name: worklog.teamLeadName, effort: worklog.effort });
    }
    return acc;
  }, []);
};

export const calculateEffortByDirector = (worklogsWithEmployeeData: WorklogWithEmployeeData[]) => {
  return worklogsWithEmployeeData.reduce((acc: any[], worklog) => {
    if (!worklog.directorName) return acc;

    const existingDirector = acc.find(item => item.name === worklog.directorName);
    if (existingDirector) {
      existingDirector.effort += worklog.effort;
    } else {
      acc.push({ name: worklog.directorName, effort: worklog.effort });
    }
    return acc;
  }, []).sort((a, b) => b.effort - a.effort);
};

export const calculateEffortByEmployee = (filteredWorklogs: any[]) => {
  return filteredWorklogs.reduce((acc: any[], worklog) => {
    const existing = acc.find(item => item.name === worklog.employeeName);
    if (existing) {
      existing.effort += worklog.effort;
    } else {
      acc.push({ name: worklog.employeeName, effort: worklog.effort });
    }
    return acc;
  }, []).sort((a, b) => b.effort - a.effort);
};

export const calculateEffortByType = (filteredWorklogs: any[]) => {
  return filteredWorklogs.reduce((acc: any[], worklog) => {
    const existing = acc.find(item => item.name === worklog.worklogTypeName);
    if (existing) {
      existing.value += worklog.effort;
    } else {
      acc.push({ name: worklog.worklogTypeName, value: worklog.effort });
    }
    return acc;
  }, []);
};

export const calculateWorklogTypeTrends = (worklogsLast3Months: any[]) => {
  return worklogsLast3Months.reduce((acc: any[], worklog) => {
    const monthYear = format(new Date(worklog.monthDate), 'MMM yyyy');
    const existingMonth = acc.find(item => item.month === monthYear);

    if (existingMonth) {
      existingMonth[worklog.worklogTypeName] = (existingMonth[worklog.worklogTypeName] || 0) + worklog.effort;
    } else {
      const newMonth: any = { month: monthYear };
      newMonth[worklog.worklogTypeName] = worklog.effort;
      acc.push(newMonth);
    }
    return acc;
  }, []).sort((a, b) => new Date(a.month) as any - (new Date(b.month) as any));
};

export const calculateKPIs = (filteredWorklogs: any[]) => {
  const totalHours = filteredWorklogs.reduce((sum, worklog) => sum + worklog.effort, 0);
  const uniqueEmployees = new Set(filteredWorklogs.map(worklog => worklog.employeeName));
  const averageHoursPerEmployee = uniqueEmployees.size > 0 ? totalHours / uniqueEmployees.size : 0;

  const worklogTypeCounts = filteredWorklogs.reduce((counts: { [key: string]: number }, worklog) => {
    counts[worklog.worklogTypeName] = (counts[worklog.worklogTypeName] || 0) + worklog.effort;
    return counts;
  }, {});

  const mostCommonWorklogType = Object.entries(worklogTypeCounts).reduce((mostCommon, [type, effort]) => {
    if (effort > mostCommon.effort) {
      return { type, effort };
    } else {
      return mostCommon;
    }
  }, { type: 'N/A', effort: 0 }).type;

  return {
    totalHours,
    averageHoursPerEmployee,
    mostCommonWorklogType
  };
}; 