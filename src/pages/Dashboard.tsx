import { useQuery } from '@tanstack/react-query';
import { worklogApi, employeeApi, worklogTypeApi } from '../api/client';
import { Tab } from '@headlessui/react';
import { ChartBarIcon, UserGroupIcon, UserIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useMonth } from '../contexts/MonthContext';
import React from 'react';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { DashboardFilters } from '../components/dashboard/DashboardFilters';
import { DashboardCard } from '../components/dashboard/DashboardCard';
import type { SortOption } from '../types/dashboard';
import {
  groupByEmployee,
  groupByTeamLead,
  groupByDirector,
  sortData,
  filterData
} from '../utils/dashboardUtils';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

type ViewType = 'By Employee' | 'By Team Lead' | 'By Director';

interface TabConfig {
  name: ViewType;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  data: any[];
}

interface WorklogTypeResponse { // Assuming this structure based on common API responses
  content: { name: string }[];
  // other properties like page, size, totalPages, etc. if they exist
}

export function Dashboard() {
  const { selectedMonth, setSelectedMonth } = useMonth();
  const [sortBy, setSortBy] = React.useState<SortOption>('hours-desc');
  const [selectedWorklogType, setSelectedWorklogType] = React.useState<string | null>(null);

  const { data: worklogs, isLoading: worklogsLoading, error: worklogsError } = useQuery({
    queryKey: ['worklogs'],
    queryFn: () => worklogApi.getAll(0, 1000).then(res => res.data.content),
    retry: 1,
  });

  const { data: employees, isLoading: employeesLoading, error: employeesError } = useQuery({
    queryKey: ['employees'],
    queryFn: () => employeeApi.getAll(0, 1000).then(res => res.data.content),
    retry: 1,
  });

  // Fetch all worklog types for filtering
  const { data: allWorklogTypes = [], isLoading: worklogTypesLoading, error: worklogTypesError } = useQuery<string[], Error>({
    queryKey: ['allWorklogTypes'],
    queryFn: () => worklogTypeApi.getAll(0, 100).then((res: { data: WorklogTypeResponse }) => res.data.content.map(type => type.name)).then((names: string[]) => names.sort()),
    retry: 1,
  });

  const isLoading = worklogsLoading || employeesLoading || worklogTypesLoading;
  const error = worklogsError || employeesError || worklogTypesError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Failed to load dashboard data. Please try again later.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-red-600 hover:text-red-500 font-medium"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Filter worklogs by selected month
  const filteredWorklogs = worklogs?.filter(worklog => {
    const worklogDate = new Date(worklog.monthDate);
    const selectedDate = new Date(selectedMonth);
    return (
      worklogDate.getMonth() === selectedDate.getMonth() &&
      worklogDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Process data with sorting and filtering
  const processData = (data: any[]) => {
    return sortData(filterData(data, selectedWorklogType), sortBy);
  };

  const tabs: TabConfig[] = [
    { 
      name: 'By Employee', 
      icon: UserIcon, 
      data: processData(Object.values(groupByEmployee(employees || [], filteredWorklogs || []))) 
    },
    { 
      name: 'By Team Lead', 
      icon: UserGroupIcon, 
      data: processData(Object.values(groupByTeamLead(employees || [], filteredWorklogs || []))) 
    },
    { 
      name: 'By Director', 
      icon: ChartBarIcon, 
      data: processData(Object.values(groupByDirector(employees || [], filteredWorklogs || []))) 
    },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />

      <Tab.Group>
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between w-full">
            <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1">
              {tabs.map((tab) => (
                <Tab
                  key={tab.name}
                  className={({ selected }) =>
                    classNames(
                      'flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium leading-5',
                      'ring-white ring-opacity-60 ring-offset-2 ring-offset-indigo-400 focus:outline-none focus:ring-2',
                      selected
                        ? 'bg-white text-indigo-700 shadow'
                        : 'text-gray-600 hover:bg-white/[0.12] hover:text-gray-800'
                    )
                  }
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.name}
                </Tab>
              ))}
            </Tab.List>

            <DashboardFilters
              selectedWorklogType={selectedWorklogType}
              setSelectedWorklogType={setSelectedWorklogType}
              sortBy={sortBy}
              setSortBy={setSortBy}
              allWorklogTypes={allWorklogTypes}
            />
          </div>
        </div>

        <Tab.Panels className="mt-6">
          {tabs.map((tab) => (
            <Tab.Panel key={tab.name}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tab.data.map((group) => (
                  <DashboardCard key={group.id} group={group} viewType={tab.name} />
                ))}
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
} 