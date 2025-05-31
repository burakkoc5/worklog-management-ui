import React from 'react';

interface KPICardsProps {
  totalHours: number;
  averageHoursPerEmployee: number;
  mostCommonWorklogType: string;
}

export const KPICards: React.FC<KPICardsProps> = ({
  totalHours,
  averageHoursPerEmployee,
  mostCommonWorklogType,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-sm font-medium text-gray-500">Total Hours</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{totalHours.toFixed(2)}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-sm font-medium text-gray-500">Avg. Hours per Employee</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{averageHoursPerEmployee.toFixed(2)}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-sm font-medium text-gray-500">Most Common Worklog Type</p>
        <p className="mt-1 text-2xl font-semibold text-gray-900">{mostCommonWorklogType}</p>
      </div>
    </div>
  );
}; 