import type { WorklogType } from './types';

interface WorklogTypeFormProps {
  formData: Partial<WorklogType>;
  setFormData: (data: Partial<WorklogType>) => void;
}

export function WorklogTypeForm({ formData, setFormData }: WorklogTypeFormProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
      <input
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        value={formData.name || ''}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
    </div>
  );
} 