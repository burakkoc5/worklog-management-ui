import type { Employee } from './types';

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function EmployeeList({ employees, onEdit, onDelete }: EmployeeListProps) {
  return (
    <div className="space-y-2">
      {employees.map((employee) => (
        <div key={employee.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100">
          <div>
            <div className="font-medium">{employee.firstName} {employee.lastName}</div>
            <div className="text-sm text-gray-500 pr-4 min-w-0 flex-grow">
              Grade: {employee.gradeName}
              {employee.teamLeadName ? ` | Team Lead: ${employee.teamLeadName}` : ''}
              {employee.directorName ? ` | Director: ${employee.directorName}` : ''}
              {employee.startDate ? ` | Start Date: ${new Date(employee.startDate).toLocaleDateString()}` : ''}
              {employee.endDate ? ` | End Date: ${new Date(employee.endDate).toLocaleDateString()}` : ''}
            </div>
          </div>
          <div className="space-x-2 flex-shrink-0">
            <button
              onClick={() => onEdit(employee.id)}
              className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(employee.id)}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 