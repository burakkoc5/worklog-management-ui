import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { COLORS } from './analyticsUtils';

interface WorklogTypeDistributionPerEmployeeChartProps {
  data: any[];
  uniqueWorklogTypes: string[];
}

export const WorklogTypeDistributionPerEmployeeChart: React.FC<WorklogTypeDistributionPerEmployeeChartProps> = ({
  data,
  uniqueWorklogTypes,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Worklog Type Distribution per Employee</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} style={{ fontSize: '10px' }} />
            <YAxis />
            <Tooltip formatter={(value: any, name) => [
              `${typeof value === 'number' ? value.toFixed(2) : value} hrs`,
              name
            ]} />
            <Legend />
            {uniqueWorklogTypes.map((type, index) => (
              <Bar key={type} dataKey={type} fill={COLORS[index % COLORS.length]} name={type} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 