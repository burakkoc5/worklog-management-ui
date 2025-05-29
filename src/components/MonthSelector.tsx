import { useState, useEffect } from 'react';
import { format, subMonths } from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface MonthSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MonthSelector({ value, onChange }: MonthSelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);

  useEffect(() => {
    // Generate last 12 months and next 12 months
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

  const handlePreviousMonth = () => {
    const current = new Date(value);
    current.setMonth(current.getMonth() - 1);
    onChange(format(current, 'yyyy-MM'));
  };

  const handleNextMonth = () => {
    const current = new Date(value);
    current.setMonth(current.getMonth() + 1);
    onChange(format(current, 'yyyy-MM'));
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-4 bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5 p-2">
        <button
          onClick={handlePreviousMonth}
          className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="text-sm font-medium text-gray-900 hover:text-indigo-600 focus:outline-none"
        >
          {format(new Date(value), 'MMMM yyyy')}
        </button>
        <button
          onClick={handleNextMonth}
          className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      {isDropdownOpen && (
        <div className="absolute z-10 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="py-1 max-h-60 overflow-auto" role="menu">
            {availableMonths.map((month) => (
              <button
                key={month}
                onClick={() => {
                  onChange(month);
                  setIsDropdownOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  month === value
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                role="menuitem"
              >
                {format(new Date(month), 'MMMM yyyy')}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 