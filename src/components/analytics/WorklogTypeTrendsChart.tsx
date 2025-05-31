import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { COLORS } from './analyticsUtils';

interface WorklogTypeTrendsChartProps {
  data: any[];
  uniqueWorklogTypes: string[];
}

export const WorklogTypeTrendsChart: React.FC<WorklogTypeTrendsChartProps> = ({
  data,
  uniqueWorklogTypes,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Worklog Type Trends (Last 3 Months)</h2>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value: any, name) => [
              `${typeof value === 'number' ? value.toFixed(2) : value} hrs`,
              name
            ]} />
            <Legend />
            {uniqueWorklogTypes.map((type, index) => (
              <Line
                key={type}
                type="monotone"
                dataKey={type}
                stroke={COLORS[index % COLORS.length]}
                name={type}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}; 