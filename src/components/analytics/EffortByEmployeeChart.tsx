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

interface EffortByEmployeeChartProps {
  data: Array<{
    name: string;
    effort: number;
  }>;
}

export const EffortByEmployeeChart: React.FC<EffortByEmployeeChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Effort Distribution by Employee</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" interval={0} style={{ fontSize: '10px' }} />
            <YAxis />
            <Tooltip formatter={(value) => [
              `${value} hrs`,
              'Effort'
            ]} />
            <Legend />
            <Bar dataKey="effort" fill="#8884d8" name="Effort (hrs)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 