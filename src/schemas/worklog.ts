import { z } from 'zod';

export const createWorklogSchema = z.object({
  employeeId: z.number().min(1, 'Employee is required'),
  monthDate: z.string().regex(/^\d{4}-\d{2}$/, 'Invalid month format (YYYY-MM)'),
  worklogTypeId: z.number().min(1, 'Worklog type is required'),
  effort: z.number().min(0, 'Effort must be positive').max(720, 'Effort cannot exceed 720 hours'),
});

export const updateWorklogSchema = createWorklogSchema.partial();

export type CreateWorklogFormData = z.infer<typeof createWorklogSchema>;
export type UpdateWorklogFormData = z.infer<typeof updateWorklogSchema>; 