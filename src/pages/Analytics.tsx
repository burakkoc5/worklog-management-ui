import { useQuery } from '@tanstack/react-query';
import { worklogApi } from '../api/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { format } from 'date-fns';
import { MonthSelector } from '../components/MonthSelector';
import { useMonth } from '../contexts/MonthContext';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

export function Analytics() {
  const { selectedMonth, setSelectedMonth } = useMonth();

  const { data: worklogs = [], isLoading, error } = useQuery({
    queryKey: ['worklogs'],
    queryFn: async () => {
      const response = await worklogApi.getAll(0, 1000);
      return response.data.content;
    },
  });

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
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Failed to load analytics data. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
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

  // Prepare data for charts
  const effortByEmployee = filteredWorklogs.reduce((acc: any[], worklog) => {
    const existing = acc.find(item => item.name === worklog.employeeName);
    if (existing) {
      existing.effort += worklog.effort;
    } else {
      acc.push({ name: worklog.employeeName, effort: worklog.effort });
    }
    return acc;
  }, []);

  const effortByType = filteredWorklogs.reduce((acc: any[], worklog) => {
    const existing = acc.find(item => item.name === worklog.worklogTypeName);
    if (existing) {
      existing.value += worklog.effort;
    } else {
      acc.push({ name: worklog.worklogTypeName, value: worklog.effort });
    }
    return acc;
  }, []);

  const effortByMonth = worklogs.reduce((acc: any[], worklog) => {
    const month = format(new Date(worklog.monthDate), 'MMM yyyy');
    const existing = acc.find(item => item.month === month);
    if (existing) {
      existing.effort += worklog.effort;
    } else {
      acc.push({ 
        month, 
        effort: worklog.effort,
        date: new Date(worklog.monthDate)
      });
    }
    return acc;
  }, [])
  .sort((a, b) => a.date.getTime() - b.date.getTime())
  .map(({ month, effort }) => ({ month, effort }));

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
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Effort Distribution by Employee</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={effortByEmployee}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} hrs`, 'Effort']} />
                  <Legend />
                  <Bar dataKey="effort" fill="#8884d8" name="Effort (hrs)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Effort Distribution by Worklog Type</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={effortByType}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} (${value} hrs)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {effortByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} hrs`, 'Effort']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Effort Trends Over Time</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={effortByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} hrs`, 'Effort']} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="effort"
                    stroke="#8884d8"
                    name="Total Effort (hrs)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 