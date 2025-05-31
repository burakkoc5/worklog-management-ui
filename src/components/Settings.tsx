import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { employeeApi, worklogTypeApi, gradeApi } from '../api/client';
import { EmployeeForm } from './settings/EmployeeForm';
import { WorklogTypeForm } from './settings/WorklogTypeForm';
import { GradeForm } from './settings/GradeForm';
import { EmployeeList } from './settings/EmployeeList';
import { WorklogTypeList } from './settings/WorklogTypeList';
import { GradeList } from './settings/GradeList';
import { ConfirmationDialog } from './ConfirmationDialog';
import toast from 'react-hot-toast';
import type { Employee, WorklogType, Grade } from '../types';
import { ErrorState } from './common/ErrorState';

export function Settings({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('employees');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [worklogTypes, setWorklogTypes] = useState<WorklogType[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [error, setError] = useState<Error | null>(null);

  type Tab = 'employees' | 'worklogTypes' | 'grades';

  const fetchData = async () => {
    try {
      setError(null);
      const [employeesRes, worklogTypesRes, gradesRes] = await Promise.all([
        employeeApi.getAll(0, 100),
        worklogTypeApi.getAll(0, 100),
        gradeApi.getAll(0, 100)
      ]);
      setEmployees(employeesRes.data.content);
      setWorklogTypes(worklogTypesRes.data.content);
      setGrades(gradesRes.data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error as Error);
      toast.error('Failed to fetch settings data');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const handleCreate = async () => {
    try {
      switch (activeTab) {
        case 'employees':
          await employeeApi.create(formData);
          toast.success('Employee created successfully!');
          break;
        case 'worklogTypes':
          await worklogTypeApi.create(formData);
          toast.success('Worklog Type created successfully!');
          break;
        case 'grades':
          await gradeApi.create(formData);
          toast.success('Grade created successfully!');
          break;
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating item:', error);
      toast.error(`Failed to create ${activeTab.slice(0, -1)}.`);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;

    try {
      switch (activeTab) {
        case 'employees':
          await employeeApi.update(editingId, formData);
          toast.success('Employee updated successfully!');
          break;
        case 'worklogTypes':
          await worklogTypeApi.update(editingId, formData);
          toast.success('Worklog Type updated successfully!');
          break;
        case 'grades':
          await gradeApi.update(editingId, formData);
          toast.success('Grade updated successfully!');
          break;
      }
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error(`Failed to update ${activeTab.slice(0, -1)}.`);
    }
  };

  const handleDelete = async (id: number) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      switch (activeTab) {
        case 'employees':
          await employeeApi.delete(itemToDelete);
          toast.success('Employee deleted successfully!');
          break;
        case 'worklogTypes':
          await worklogTypeApi.delete(itemToDelete);
          toast.success('Worklog Type deleted successfully!');
          break;
        case 'grades':
          await gradeApi.delete(itemToDelete);
          toast.success('Grade deleted successfully!');
          break;
      }
      fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(`Failed to delete ${activeTab.slice(0, -1)}.`);
    }
  };

  const handleEdit = async (id: number) => {
    let item;
    switch (activeTab) {
      case 'employees':
        item = employees.find(e => e.id === id);
        break;
      case 'worklogTypes':
        item = worklogTypes.find(t => t.id === id);
        break;
      case 'grades':
        item = grades.find(g => g.id === id);
        break;
    }

    if (item) {
      setFormData(item);
      setEditingId(id);
      setIsEditing(true);
      setIsCreating(true);
    }
  };

  const resetForm = () => {
    setIsCreating(false);
    setIsEditing(false);
    setFormData({});
    setEditingId(null);
  };

  const renderForm = () => {
    switch (activeTab) {
      case 'employees':
        return <EmployeeForm formData={formData} setFormData={setFormData} grades={grades} employees={employees} />;
      case 'worklogTypes':
        return <WorklogTypeForm formData={formData} setFormData={setFormData} />;
      case 'grades':
        return <GradeForm formData={formData} setFormData={setFormData} />;
    }
  };

  const renderList = () => {
    switch (activeTab) {
      case 'employees':
        return <EmployeeList employees={employees} onEdit={handleEdit} onDelete={handleDelete} />;
      case 'worklogTypes':
        return <WorklogTypeList worklogTypes={worklogTypes} onEdit={handleEdit} onDelete={handleDelete} />;
      case 'grades':
        return <GradeList grades={grades} onEdit={handleEdit} onDelete={handleDelete} />;
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full rounded-lg bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-lg font-medium text-gray-900">Settings</Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {error ? (
            <ErrorState 
              message="Failed to load settings data. Please try again later." 
              onRetry={fetchData}
            />
          ) : (
            <>
              <div className="flex border-b border-gray-300">
                <button
                  className={`px-4 py-2 ${
                    activeTab === 'employees' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'
                  }`}
                  onClick={() => {
                    resetForm();
                    setActiveTab('employees');
                  }}
                >
                  Employees
                </button>
                <button
                  className={`px-4 py-2 ${
                    activeTab === 'worklogTypes' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'
                  }`}
                  onClick={() => {
                    resetForm();
                    setActiveTab('worklogTypes');
                  }}
                >
                  Worklog Types
                </button>
                <button
                  className={`px-4 py-2 ${
                    activeTab === 'grades' ? 'border-b-2 border-indigo-500 text-indigo-600' : 'text-gray-500'
                  }`}
                  onClick={() => {
                    resetForm();
                    setActiveTab('grades');
                  }}
                >
                  Grades
                </button>
              </div>

              <div className="p-4 overflow-y-auto">
                {isCreating ? (
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      {isEditing ? 'Edit' : 'Add New'} {activeTab === 'employees' ? 'Employee' : activeTab === 'worklogTypes' ? 'Worklog Type' : 'Grade'}
                    </h3>
                    {renderForm()}
                    <div className="mt-4 flex justify-end space-x-2">
                      <button
                        onClick={resetForm}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={isEditing ? handleUpdate : handleCreate}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                      >
                        {isEditing ? 'Update' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium">
                        {activeTab === 'employees' ? 'Employee List' : activeTab === 'worklogTypes' ? 'Worklog Types' : 'Grades'}
                      </h3>
                      <button
                        onClick={() => setIsCreating(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                      >
                        Add New {activeTab === 'employees' ? 'Employee' : activeTab === 'worklogTypes' ? 'Worklog Type' : 'Grade'}
                      </button>
                    </div>
                    {renderList()}
                  </>
                )}
              </div>
            </>
          )}
        </Dialog.Panel>
      </div>

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete ${activeTab === 'employees' ? 'Employee' : activeTab === 'worklogTypes' ? 'Worklog Type' : 'Grade'}`}
        message={`Are you sure you want to delete this ${activeTab.slice(0, -1)}? This action cannot be undone.`}
      />
    </Dialog>
  );
} 