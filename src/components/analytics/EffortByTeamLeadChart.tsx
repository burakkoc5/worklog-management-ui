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

interface EffortByTeamLeadChartProps {
  data: Array<{
    name: string;
    effort: number;
  }>;
}

export const EffortByTeamLeadChart: React.FC<EffortByTeamLeadChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Total Effort by Team Lead</h2>
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
            <Bar dataKey="effort" fill="#ffc658" name="Total Effort (hrs)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 