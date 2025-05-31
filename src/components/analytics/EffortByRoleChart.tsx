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

interface EffortByRoleChartProps {
  data: Array<{
    role: string;
    averageEffort: number;
  }>;
}

export const EffortByRoleChart: React.FC<EffortByRoleChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Average Effort by Role</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="role" />
            <YAxis />
            <Tooltip formatter={(value: any) => [
              `${typeof value === 'number' ? value.toFixed(2) : value} hrs`,
              'Average Effort'
            ]} />
            <Legend />
            <Bar dataKey="averageEffort" fill="#82ca9d" name="Average Effort (hrs)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 