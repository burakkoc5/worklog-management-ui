import { Menu } from '@headlessui/react';
import { ChevronDownIcon, FunnelIcon, ArrowsUpDownIcon } from '@heroicons/react/20/solid';
import type { WorklogEntriesSortOption } from '../../types/dashboard';

interface WorklogEntriesFiltersProps {
  selectedValue: string | null;
  setSelectedValue: (value: string | null) => void;
  sortBy: WorklogEntriesSortOption;
  setSortBy: (sort: WorklogEntriesSortOption) => void;
  allOptions: string[];
  filterLabel?: string; // Optional prop for the filter dropdown label
}

export function WorklogEntriesFilters({
  selectedValue,
  setSelectedValue,
  sortBy,
  setSortBy,
  allOptions,
  filterLabel = 'All', // Default label is 'All'
}: WorklogEntriesFiltersProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Active Filter Display */}
      {selectedValue && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-md">
          <span className="text-sm text-indigo-700">Filter: {selectedValue}</span>
          <button
            onClick={() => setSelectedValue(null)}
            className="text-indigo-600 hover:text-indigo-800"
          >
            <span className="sr-only">Remove filter</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Active Sort Display */}
      {sortBy !== 'hours-desc' && (
        <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 rounded-md">
          <span className="text-sm text-indigo-700">
            {sortBy === 'hours-asc' ? 'Hours (Low to High)' :
             sortBy === 'name-asc' ? 'Name (A to Z)' :
             sortBy === 'name-desc' ? 'Name (Z to A)' :
             sortBy === 'createdAt-asc' ? 'Created At (Old to New)' :
             sortBy === 'createdAt-desc' ? 'Created At (New to Old)' :
             sortBy === 'updatedAt-asc' ? 'Updated At (Old to New)' :
             'Updated At (New to Old)'}
          </span>
          <button
            onClick={() => setSortBy('hours-desc')}
            className="text-indigo-600 hover:text-indigo-800"
          >
            <span className="sr-only">Reset sort</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Menu as="div" className="relative">
          <Menu.Button className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <FunnelIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            Filter
            <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto max-h-60">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setSelectedValue(null)}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block w-full px-4 py-2 text-left text-sm`}
                  >
                    {filterLabel}
                  </button>
                )}
              </Menu.Item>
              {allOptions.map((option: string) => (
                <Menu.Item key={option}>
                  {({ active }) => (
                    <button
                      onClick={() => setSelectedValue(option)}
                      className={`${
                        active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                      } block w-full px-4 py-2 text-left text-sm ${
                        selectedValue === option ? 'bg-indigo-50 text-indigo-700' : ''
                      }`}
                    >
                      {option}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Menu>

        <Menu as="div" className="relative">
          <Menu.Button className="inline-flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            Sort
            <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
          </Menu.Button>
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setSortBy('hours-desc')}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block w-full px-4 py-2 text-left text-sm ${
                      sortBy === 'hours-desc' ? 'bg-indigo-50 text-indigo-700' : ''
                    }`}
                  >
                    Hours (High to Low)
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setSortBy('hours-asc')}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block w-full px-4 py-2 text-left text-sm ${
                      sortBy === 'hours-asc' ? 'bg-indigo-50 text-indigo-700' : ''
                    }`}
                  >
                    Hours (Low to High)
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setSortBy('name-asc')}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block w-full px-4 py-2 text-left text-sm ${
                      sortBy === 'name-asc' ? 'bg-indigo-50 text-indigo-700' : ''
                    }`}
                  >
                    Name (A to Z)
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setSortBy('name-desc')}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block w-full px-4 py-2 text-left text-sm ${
                      sortBy === 'name-desc' ? 'bg-indigo-50 text-indigo-700' : ''
                    }`}
                  >
                    Name (Z to A)
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setSortBy('createdAt-asc')}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block w-full px-4 py-2 text-left text-sm ${
                      sortBy === 'createdAt-asc' ? 'bg-indigo-50 text-indigo-700' : ''
                    }`}
                  >
                    Created At (Old to New)
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setSortBy('createdAt-desc')}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block w-full px-4 py-2 text-left text-sm ${
                      sortBy === 'createdAt-desc' ? 'bg-indigo-50 text-indigo-700' : ''
                    }`}
                  >
                    Created At (New to Old)
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setSortBy('updatedAt-asc')}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block w-full px-4 py-2 text-left text-sm ${
                      sortBy === 'updatedAt-asc' ? 'bg-indigo-50 text-indigo-700' : ''
                    }`}
                  >
                    Updated At (Old to New)
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => setSortBy('updatedAt-desc')}
                    className={`${
                      active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                    } block w-full px-4 py-2 text-left text-sm ${
                      sortBy === 'updatedAt-desc' ? 'bg-indigo-50 text-indigo-700' : ''
                    }`}
                  >
                    Updated At (New to Old)
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
} 