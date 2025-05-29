import type { WorklogType } from './types';

interface WorklogTypeListProps {
  worklogTypes: WorklogType[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

export function WorklogTypeList({ worklogTypes, onEdit, onDelete }: WorklogTypeListProps) {
  return (
    <div className="space-y-2">
      {worklogTypes.map((type) => (
        <div key={type.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md hover:bg-gray-100">
          <span className="font-medium">{type.name}</span>
          <div className="space-x-2">
            <button
              onClick={() => onEdit(type.id)}
              className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(type.id)}
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