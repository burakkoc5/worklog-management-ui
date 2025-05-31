import { UserCircleIcon, UserGroupIcon, XCircleIcon } from '@heroicons/react/24/outline';
import type { GroupedData, WorklogSummary } from '../../types/dashboard';

interface DashboardCardProps {
  group: GroupedData;
  viewType: 'By Employee' | 'By Team Lead' | 'By Director';
}

function getRoleBadge(role: string) {
  const baseClasses = "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium";
  switch (role) {
    case 'Director':
      return (
        <span className={`${baseClasses} bg-purple-100 text-purple-700`}>
          <UserCircleIcon className="h-3 w-3" />
          Director
        </span>
      );
    case 'Team Lead':
      return (
        <span className={`${baseClasses} bg-blue-100 text-blue-700`}>
          <UserGroupIcon className="h-3 w-3" />
          Team Lead
        </span>
      );
    default:
      return null;
  }
}

function getQuitBadge(endDate: string | null | undefined) {
  if (!endDate || new Date(endDate) > new Date()) return null;
  const quitDate = new Date(endDate).toLocaleDateString();
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
      <XCircleIcon className="h-3 w-3" />
      Quit: {quitDate}
    </span>
  );
}

export function DashboardCard({ group, viewType }: DashboardCardProps) {
  const isQuit = group.endDate && new Date(group.endDate) <= new Date();
  const cardClasses = `overflow-hidden shadow-sm ring-1 ${isQuit ? 'ring-red-300 bg-red-50/80' : 'ring-gray-900/5 bg-white'} rounded-lg relative`;
  const quitDate = isQuit ? new Date(group.endDate!).toLocaleDateString() : '';

  return (
    <div className={cardClasses}>
      {isQuit && (
        <div className="absolute top-2 right-2">
          <XCircleIcon className="h-6 w-6 text-red-500" />
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div>
              <h3 className={`text-lg font-medium leading-6 ${isQuit ? 'text-red-900' : 'text-gray-900'}`}>
                {group.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {group.gradeName && (
                  <p className={`text-xs ${isQuit ? 'text-red-700' : 'text-gray-500'}`}>
                    {group.gradeName}
                  </p>
                )}
                {isQuit && getQuitBadge(group.endDate)}
              </div>
            </div>
            {!group.children && group.role && (
              <div className="flex-shrink-0">
                {getRoleBadge(group.role)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center rounded-md ${isQuit ? 'bg-red-50 text-red-700 ring-red-600/10' : 'bg-indigo-50 text-indigo-700 ring-indigo-700/10'} px-2 py-1 text-xs font-medium ring-1 ring-inset`}>
              {group.totalEffort} hrs Total
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {(viewType === 'By Director' || viewType === 'By Team Lead') && 
           group.leaderWorklogSummary && 
           group.leaderWorklogSummary.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Leader's Worklogs: {group.leaderEffort} hrs</p>
              {group.leaderWorklogSummary.map((summary, index) => (
                <div key={index} className="flex items-center justify-between text-sm text-gray-700 ml-4">
                  <span className="text-gray-500">{summary.worklogTypeName}</span>
                  <span className="text-gray-900 font-medium">{summary.effort} hrs</span>
                </div>
              ))}
            </div>
          )}

          {group.children ? (
            group.children.map(child => {
              const isChildQuit = child.endDate && new Date(child.endDate) <= new Date();
              return (
                <div key={child.id} className={`space-y-2 pt-3 border-t border-gray-200 first:border-none first:pt-0 ${isChildQuit ? 'bg-red-50/50 rounded-md p-2' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className={`text-sm font-medium ${isChildQuit ? 'text-red-900' : 'text-gray-900'}`}>{child.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {child.gradeName && (
                            <p className={`text-xs ${isChildQuit ? 'text-red-700' : 'text-gray-500'}`}>
                              {child.gradeName}
                            </p>
                          )}
                          {getQuitBadge(child.endDate)}
                        </div>
                      </div>
                      {child.role && (
                        <div className="flex-shrink-0">
                          {getRoleBadge(child.role)}
                        </div>
                      )}
                    </div>
                    <span className={`text-sm ${isChildQuit ? 'text-red-700' : 'text-gray-500'}`}>
                      {child.totalEffort} hrs
                    </span>
                  </div>
                  {(viewType === 'By Team Lead' || viewType === 'By Director') && child.worklogs && child.worklogs.length > 0 && (
                    child.worklogs.reduce((summaryAcc: WorklogSummary[], worklog: any) => {
                      const existing = summaryAcc.find(item => item.worklogTypeName === worklog.worklogTypeName);
                      if (existing) {
                        existing.effort += worklog.effort;
                      } else {
                        summaryAcc.push({ worklogTypeName: worklog.worklogTypeName, effort: worklog.effort });
                      }
                      return summaryAcc;
                    }, [] as WorklogSummary[]).map((summary, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm text-gray-700 ml-4"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">
                            {summary.worklogTypeName}
                          </span>
                          <span className="text-gray-900 font-medium">
                            {summary.effort} hrs
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  {viewType === 'By Employee' && (
                    child.worklogs.reduce((summaryAcc: WorklogSummary[], worklog: any) => {
                      const existing = summaryAcc.find(item => item.worklogTypeName === worklog.worklogTypeName);
                      if (existing) {
                        existing.effort += worklog.effort;
                      } else {
                        summaryAcc.push({ worklogTypeName: worklog.worklogTypeName, effort: worklog.effort });
                      }
                      return summaryAcc;
                    }, [] as WorklogSummary[]).map((summary, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm text-gray-700 ml-4"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">
                            {summary.worklogTypeName}
                          </span>
                          <span className="text-gray-900 font-medium">
                            {summary.effort} hrs
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              );
            })
          ) : (
            group.worklogs.reduce((summaryAcc: WorklogSummary[], worklog: any) => {
              const existing = summaryAcc.find(item => item.worklogTypeName === worklog.worklogTypeName);
              if (existing) {
                existing.effort += worklog.effort;
              } else {
                summaryAcc.push({ worklogTypeName: worklog.worklogTypeName, effort: worklog.effort });
              }
              return summaryAcc;
            }, [] as WorklogSummary[]).map((summary, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">
                    {summary.worklogTypeName}
                  </span>
                  <span className="text-gray-900 font-medium">
                    {summary.effort} hrs
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 