import { useState, useEffect } from 'react';
import { worklogApi, employeeApi } from '../api/client';
import type { Worklog, Employee } from '../types';
import type { WorklogEntriesSortOption } from '../types/dashboard';
import { WorklogEntriesFilters } from '../components/dashboard/WorklogEntriesFilters';
import { Pagination } from '../components/Pagination';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

// Helper to determine sort direction from SortOption (duplicate logic, should ideally be in a shared place)
const getSortDirection = (sortBy: WorklogEntriesSortOption): 'asc' | 'desc' => {
  if (sortBy.includes('asc')) return 'asc';
  if (sortBy.includes('desc')) return 'desc';
  return 'asc'; // Default
};

// Helper for client-side sorting
const sortWorklogs = (worklogs: Worklog[], sortBy: WorklogEntriesSortOption): Worklog[] => {
  const direction = getSortDirection(sortBy);
  const [key] = sortBy.split('-'); 

  // Map the sort key 'name' to the actual property 'employeeName'
  const sortKey = key === 'name' ? 'employeeName' : key;

  return [...worklogs].sort((a, b) => {
    const aValue = a[sortKey as keyof Worklog];
    const bValue = b[sortKey as keyof Worklog];

    if (aValue === null || aValue === undefined) return direction === 'asc' ? 1 : -1;
    if (bValue === null || bValue === undefined) return direction === 'asc' ? -1 : 1;

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
    }

    if (aValue < bValue) {
      return direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

export function WorklogEntries() {
  const [allWorklogs, setAllWorklogs] = useState<Worklog[]>([]); // State to store all fetched worklogs
  const [displayedWorklogs, setDisplayedWorklogs] = useState<Worklog[]>([]); // State for worklogs on the current page
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]); // State to store all employees
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Worklog>>({});
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<WorklogEntriesSortOption>('hours-desc');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [worklogToDelete, setWorklogToDelete] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch all worklogs with optional employee filter
  const fetchAllWorklogs = async (currentSelectedEmployee: string | null) => {
    try {
      let response;
      const size = 1000; // Fetch a large number of worklogs
      const defaultSortBy: WorklogEntriesSortOption = 'createdAt-desc'; // Default sort for initial fetch
      const defaultSortDirection = getSortDirection(defaultSortBy); // Get direction for the default sort

      if (currentSelectedEmployee) {
        const employee = allEmployees.find(emp => `${emp.firstName} ${emp.lastName}` === currentSelectedEmployee);
        if (employee) {
          // When filtering by employee, the backend might still paginate, so we fetch a large chunk
          response = await worklogApi.getByEmployeeId(employee.id, 0, size, defaultSortBy, defaultSortDirection); // Fetching a large size, sort parameters here are less critical as we sort client-side
        } else {
          setAllWorklogs([]);
          return;
        }
      } else {
        // Fetch all worklogs without employee filter
        response = await worklogApi.getAll(0, size, defaultSortBy, defaultSortDirection); // Fetching a large size, sort parameters here are less critical as we sort client-side
      }

      setAllWorklogs(response.data.content);
    } catch (error) {
      console.error('Error fetching all worklogs:', error);
      toast.error('Failed to fetch all worklogs');
    }
  };

  // Fetch all employees for the filter dropdown
  const fetchAllEmployees = async () => {
    try {
      // Fetching a large size to get all employees. Consider implementing pagination for employees if the list is very large.
      const response = await employeeApi.getAll(0, 1000); 
      setAllEmployees(response.data.content);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to fetch employees for filtering');
    }
  };

  useEffect(() => {
    fetchAllEmployees(); // Fetch all employees when component mounts
  }, []);

  // Fetch all worklogs whenever the selected employee filter changes
  useEffect(() => {
    fetchAllWorklogs(selectedEmployee);
  }, [selectedEmployee, allEmployees]); // Depend on selectedEmployee and allEmployees to ensure employee data is available

  // Apply sorting and pagination whenever allWorklogs, sortBy, currentPage, or itemsPerPage changes
  useEffect(() => {
    const sortedWorklogs = sortWorklogs(allWorklogs, sortBy);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedWorklogs(sortedWorklogs.slice(startIndex, endIndex));
    setTotalPages(Math.ceil(sortedWorklogs.length / itemsPerPage));
  }, [allWorklogs, sortBy, currentPage, itemsPerPage]);

  const handleEdit = (worklog: Worklog) => {
    setFormData(worklog);
    setEditingId(worklog.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: number) => {
    setWorklogToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!worklogToDelete) return;

    try {
      await worklogApi.delete(worklogToDelete);
      toast.success('Worklog deleted successfully');
      // After deletion, refetch all worklogs to update the list
      fetchAllWorklogs(selectedEmployee);
    } catch (error) {
      console.error('Error deleting worklog:', error);
      toast.error('Failed to delete worklog');
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      await worklogApi.update(editingId, formData);
      toast.success('Worklog updated successfully');
      setIsEditing(false);
      setEditingId(null);
      setFormData({});
      // After update, refetch all worklogs to update the list
      fetchAllWorklogs(selectedEmployee);
    } catch (error) {
      console.error('Error updating worklog:', error);
      toast.error('Failed to update worklog');
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(0); // Reset to first page when changing items per page
  };

  // Prepare employee names for the filter dropdown
  const employeeNamesForFilter = allEmployees.map(emp => `${emp.firstName} ${emp.lastName}`).sort();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Worklog Entries</h1>
        {!isEditing && (
          <div>
            <WorklogEntriesFilters
              selectedValue={selectedEmployee}
              setSelectedValue={setSelectedEmployee}
              sortBy={sortBy}
              setSortBy={setSortBy}
              allOptions={employeeNamesForFilter}
              filterLabel="All Employees"
            />
          </div>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Edit Worklog</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.employeeName || ''}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
              <input
                type="month"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.monthDate || ''}
                onChange={(e) => setFormData({ ...formData, monthDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Worklog Type</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.worklogTypeName || ''}
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Effort (hours)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.effort || ''}
                onChange={(e) => setFormData({ ...formData, effort: Number(e.target.value) })}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingId(null);
                  setFormData({});
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worklog Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Effort</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated At</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayedWorklogs.length > 0 ? (
                  displayedWorklogs.map((worklog) => (
                    <tr key={worklog.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{worklog.employeeName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{worklog.monthDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{worklog.worklogTypeName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{worklog.effort} hours</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{worklog.createdAt ? format(new Date(worklog.createdAt), 'yyyy-MM-dd HH:mm') : 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{worklog.updatedAt ? format(new Date(worklog.updatedAt), 'yyyy-MM-dd HH:mm') : 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(worklog)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(worklog.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                      {selectedEmployee
                        ? `No worklog entries found for ${selectedEmployee}`
                        : 'No worklog entries found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!isEditing && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Worklog"
        message="Are you sure you want to delete this worklog entry? This action cannot be undone."
      />
    </div>
  );
} 