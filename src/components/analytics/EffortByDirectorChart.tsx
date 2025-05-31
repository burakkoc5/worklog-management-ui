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

interface EffortByDirectorChartProps {
  data: Array<{
    name: string;
    effort: number;
  }>;
}

export const EffortByDirectorChart: React.FC<EffortByDirectorChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Total Effort by Director</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: any) => [
              `${typeof value === 'number' ? value.toFixed(2) : value} hrs`,
              'Total Effort'
            ]} />
            <Legend />
            <Bar dataKey="effort" fill="#ff7300" name="Total Effort (hrs)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 