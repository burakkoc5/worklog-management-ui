import { useQuery } from '@tanstack/react-query';
import { worklogApi, employeeApi } from '../api/client';
import { MonthSelector } from '../components/MonthSelector';
import { useMonth } from '../contexts/MonthContext';
import { KPICards } from '../components/analytics/KpiCards';
import { EffortByRoleChart } from '../components/analytics/EffortByRoleChart';
import { EffortByDirectorChart } from '../components/analytics/EffortByDirectorChart';
import { EffortByTeamLeadChart } from '../components/analytics/EffortByTeamLeadChart';
import { EffortByEmployeeChart } from '../components/analytics/EffortByEmployeeChart';
import { EffortByTypeChart } from '../components/analytics/EffortByTypeChart';
import { WorklogTypeTrendsChart } from '../components/analytics/WorklogTypeTrendsChart';
import { WorklogTypeDistributionPerEmployeeChart } from '../components/analytics/WorklogTypeDistributionPerEmployeeChart';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import {
  calculateEffortByRole,
  calculateWorklogTypeDistributionPerEmployee,
  calculateEffortByTeamLead,
  calculateEffortByDirector,
  calculateEffortByEmployee,
  calculateEffortByType,
  calculateWorklogTypeTrends,
  calculateKPIs,
} from '../components/analytics/analyticsUtils';

export function Analytics() {
  const { selectedMonth, setSelectedMonth } = useMonth();

  const { data: worklogs = [], isLoading: isLoadingWorklogs, error: errorWorklogs } = useQuery({
    queryKey: ['worklogs'],
    queryFn: async () => {
      const response = await worklogApi.getAll(0, 1000);
      return response.data.content;
    },
  });

  const { data: employees = [], isLoading: isLoadingEmployees, error: errorEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const response = await employeeApi.getAll(0, 1000);
      return response.data.content;
    },
  });

  const isLoading = isLoadingWorklogs || isLoadingEmployees;
  const error = errorWorklogs || errorEmployees;

  if (isLoading) {
    return <LoadingState size="medium" className="h-64" />;
  }

  if (error) {
    return <ErrorState message="Failed to load analytics data. Please try again later." />;
  }

  // Filter worklogs by selected month
  const filteredWorklogs = worklogs.filter(worklog => {
    const worklogDate = new Date(worklog.monthDate);
    const selectedDate = new Date(selectedMonth);
    return (
      worklogDate.getMonth() === selectedDate.getMonth() &&
      worklogDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Get all unique worklog types
  const uniqueWorklogTypes = Array.from(new Set(worklogs.map(worklog => worklog.worklogTypeName)));

  // Join worklogs with employee data
  const worklogsWithEmployeeData = filteredWorklogs.map(worklog => {
    const employee = employees.find(emp => emp.firstName + ' ' + emp.lastName === worklog.employeeName);
    return {
      ...worklog,
      gradeName: employee?.gradeName,
      teamLeadName: employee?.teamLeadName,
      directorName: employee?.directorName,
    };
  });

  // Calculate data for charts
  const effortByRole = calculateEffortByRole(worklogsWithEmployeeData);
  const worklogTypeDistributionPerEmployee = calculateWorklogTypeDistributionPerEmployee(
    worklogsWithEmployeeData,
    uniqueWorklogTypes
  );
  const effortByTeamLead = calculateEffortByTeamLead(worklogsWithEmployeeData);
  const effortByDirector = calculateEffortByDirector(worklogsWithEmployeeData);
  const effortByEmployee = calculateEffortByEmployee(filteredWorklogs);
  const effortByType = calculateEffortByType(filteredWorklogs);

  // Calculate KPIs
  const { totalHours, averageHoursPerEmployee, mostCommonWorklogType } = calculateKPIs(filteredWorklogs);

  // Calculate worklog type trends over the last 3 months
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 2);
  threeMonthsAgo.setDate(1);
  threeMonthsAgo.setHours(0, 0, 0, 0);

  const worklogsLast3Months = worklogs.filter(worklog => {
    const worklogDate = new Date(worklog.monthDate);
    return worklogDate >= threeMonthsAgo;
  });

  const worklogTypeTrends = calculateWorklogTypeTrends(worklogsLast3Months);
  const uniqueWorklogTypesLast3Months = Array.from(new Set(worklogsLast3Months.map(worklog => worklog.worklogTypeName)));

  return (
    <div className="space-y-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-2xl sm:tracking-tight">
            Analytics Dashboard
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-500">
            Visualize worklog efforts over time and by different categories
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <MonthSelector value={selectedMonth} onChange={setSelectedMonth} />
        </div>
      </div>

      {filteredWorklogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-lg font-medium text-gray-600">No worklog data available for the selected month.</p>
        </div>
      ) : (
        <>
          <KPICards
            totalHours={totalHours}
            averageHoursPerEmployee={averageHoursPerEmployee}
            mostCommonWorklogType={mostCommonWorklogType}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <EffortByRoleChart data={effortByRole} />
            <EffortByDirectorChart data={effortByDirector} />
            <EffortByTeamLeadChart data={effortByTeamLead} />
          </div>

          <div className="grid grid-cols-1 mb-8">
            <EffortByEmployeeChart data={effortByEmployee} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <EffortByTypeChart data={effortByType} />
            <WorklogTypeTrendsChart
              data={worklogTypeTrends}
              uniqueWorklogTypes={uniqueWorklogTypesLast3Months}
            />
          </div>

          <div className="grid grid-cols-1 mb-8">
            <WorklogTypeDistributionPerEmployeeChart
              data={worklogTypeDistributionPerEmployee}
              uniqueWorklogTypes={uniqueWorklogTypes}
            />
          </div>
        </>
      )}
    </div>
  );
} 