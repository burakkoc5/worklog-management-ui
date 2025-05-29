import { MonthSelector } from '../MonthSelector';

interface DashboardHeaderProps {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
}

export function DashboardHeader({ selectedMonth, setSelectedMonth }: DashboardHeaderProps) {
  return (
    <div className="sm:flex sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-2xl sm:tracking-tight">
          Worklog Dashboard
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-500">
          View worklog efforts grouped by different organizational levels
        </p>
      </div>
      <div className="mt-4 sm:mt-0">
        <MonthSelector value={selectedMonth} onChange={setSelectedMonth} />
      </div>
    </div>
  );
} 