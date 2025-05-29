import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import toast, { Toaster } from 'react-hot-toast';
import { employeeApi, worklogTypeApi, worklogApi } from '../api/client';
import { createWorklogSchema, type CreateWorklogFormData } from '../schemas/worklog';
import { format, subMonths } from 'date-fns';
import { useState, useEffect } from 'react';

export function WorklogForm() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  useEffect(() => {
    // Generate last 12 months and current month
    const months: string[] = [];
    const currentDate = new Date();
    
    // Add current month
    months.push(format(currentDate, 'yyyy-MM'));

    // Add past 12 months
    for (let i = 1; i < 12; i++) {
      const date = subMonths(currentDate, i);
      months.push(format(date, 'yyyy-MM'));
    }
    setAvailableMonths(months);
  }, []);

  const { data: employees = [], isLoading: employeesLoading, error: employeesError } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      try {
        const response = await employeeApi.getAll(0, 1000);
        return response.data.content;
      } catch (error) {
        toast.error('Failed to load employees. Please try again later.');
        throw error;
      }
    },
  });

  const { data: worklogTypes = [], isLoading: worklogTypesLoading, error: worklogTypesError } = useQuery({
    queryKey: ['worklogTypes'],
    queryFn: async () => {
      try {
        const response = await worklogTypeApi.getAll(0, 1000);
        return response.data.content;
      } catch (error) {
        toast.error('Failed to load worklog types. Please try again later.');
        throw error;
      }
    },
  });

  const createWorklog = useMutation({
    mutationFn: async (data: CreateWorklogFormData) => {
      const selectedEmployee = employees.find(emp => emp.id === data.employeeId);
      const selectedWorklogType = worklogTypes.find(type => type.id === data.worklogTypeId);
      
      const worklogData = {
        ...data,
        employeeName: selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : '',
        worklogTypeName: selectedWorklogType?.name || '',
      };
      
      const response = await worklogApi.create(worklogData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worklogs'] });
      toast.success('Worklog entry created successfully!');
      navigate('/');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to create worklog entry. Please try again.';
      toast.error(errorMessage);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateWorklogFormData>({
    resolver: zodResolver(createWorklogSchema),
  });

  const selectedEmployeeId = watch('employeeId');
  const selectedWorklogTypeId = watch('worklogTypeId');

  const selectedEmployee = employees?.find(emp => emp.id === selectedEmployeeId);
  const selectedWorklogType = worklogTypes?.find(type => type.id === selectedWorklogTypeId);

  const onSubmit = (data: CreateWorklogFormData) => {
    createWorklog.mutate(data);
  };

  const inputClasses = "block w-full rounded-lg border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6";
  const labelClasses = "block text-sm font-medium leading-6 text-gray-900";
  const errorClasses = "mt-2 text-sm text-red-600";

  if (employeesLoading || worklogTypesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (employeesError || worklogTypesError) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Failed to load required data. Please try again later.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-indigo-600 hover:text-indigo-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl sm:p-8">
        <div className="border-b border-gray-900/10 pb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Worklog Entry</h1>
        <p className="mt-1 text-sm leading-6 text-gray-600">Enter the details of your worklog entry.</p>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="employeeId" className={labelClasses}>
              Employee
            </label>
            <div className="mt-2">
              <Listbox value={selectedEmployeeId} onChange={(value) => setValue('employeeId', value)}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    <span className="block truncate">
                      {selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : 'Select an employee'}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {employees.map((employee) => (
                      <Listbox.Option
                        key={employee.id}
                        value={employee.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {employee.firstName} {employee.lastName}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            {errors.employeeId && (
              <p className={errorClasses}>{errors.employeeId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="monthDate" className={labelClasses}>
              Month
            </label>
            <div className="mt-2 relative">
              <Listbox value={watch('monthDate')} onChange={(value) => setValue('monthDate', value)}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    <span className="block truncate">
                      {watch('monthDate') ? format(new Date(watch('monthDate')), 'MMMM yyyy') : 'Select a month'}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {availableMonths.map((month) => (
                      <Listbox.Option
                        key={month}
                        value={month}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {format(new Date(month), 'MMMM yyyy')}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            {errors.monthDate && (
              <p className={errorClasses}>{errors.monthDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="worklogTypeId" className={labelClasses}>
              Worklog Type
            </label>
            <div className="mt-2">
              <Listbox value={selectedWorklogTypeId} onChange={(value) => setValue('worklogTypeId', value)}>
                <div className="relative">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    <span className="block truncate">
                      {selectedWorklogType ? selectedWorklogType.name : 'Select a worklog type'}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {worklogTypes.map((type) => (
                      <Listbox.Option
                        key={type.id}
                        value={type.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                              {type.name}
                            </span>
                            {selected && (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600">
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            )}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </div>
              </Listbox>
            </div>
            {errors.worklogTypeId && (
              <p className={errorClasses}>{errors.worklogTypeId.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="effort" className={labelClasses}>
              Effort (hrs)
            </label>
            <div className="mt-2">
              <input
                type="number"
                {...register('effort', { valueAsNumber: true })}
                className={inputClasses}
                min="0"
                step="1"
                max="720"
              />
            </div>
            {errors.effort && (
              <p className={errorClasses}>{errors.effort.message}</p>
            )}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createWorklog.isPending}
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createWorklog.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
} 