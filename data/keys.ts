// Admin query keys
export const adminKeys = {
  all: () => ["admin"] as const,
  stats: () => [...adminKeys.all(), "stats"] as const,
  users: () => [...adminKeys.all(), "users"] as const,
  usersList: (params?: Record<string, unknown>) => [...adminKeys.users(), "list", params] as const,
  user: (userId: string) => [...adminKeys.users(), userId] as const,
  auditLogs: () => [...adminKeys.all(), "audit-logs"] as const,
  auditLogsList: (params?: Record<string, unknown>) => [...adminKeys.auditLogs(), "list", params] as const,
};

// Student query keys
export const studentKeys = {
  all: () => ["students"] as const,
  lists: () => [...studentKeys.all(), "list"] as const,
  list: (params?: Record<string, unknown>) => [...studentKeys.lists(), params] as const,
  details: () => [...studentKeys.all(), "detail"] as const,
  detail: (studentId: string) => [...studentKeys.details(), studentId] as const,
  results: (studentId: string, sessionId?: string) => [...studentKeys.detail(studentId), "results", sessionId] as const,
  transcript: (studentId: string) => [...studentKeys.detail(studentId), "transcript"] as const,
};

// Course query keys
export const courseKeys = {
  all: () => ["courses"] as const,
  lists: () => [...courseKeys.all(), "list"] as const,
  list: (params?: Record<string, unknown>) => [...courseKeys.lists(), params] as const,
  details: () => [...courseKeys.all(), "detail"] as const,
  detail: (courseId: string) => [...courseKeys.details(), courseId] as const,
  students: (courseId: string, sessionId: string) => [...courseKeys.detail(courseId), "students", sessionId] as const,
};

// Result query keys
export const resultKeys = {
  all: () => ["results"] as const,
  lists: () => [...resultKeys.all(), "list"] as const,
  list: (params?: Record<string, unknown>) => [...resultKeys.lists(), params] as const,
  details: () => [...resultKeys.all(), "detail"] as const,
  detail: (resultId: string) => [...resultKeys.details(), resultId] as const,
  semester: (studentId: string, sessionId: string, semester: number) =>
    [...resultKeys.all(), "semester", studentId, sessionId, semester] as const,
};

// Academic session query keys
export const sessionKeys = {
  all: () => ["sessions"] as const,
  lists: () => [...sessionKeys.all(), "list"] as const,
  list: (params?: Record<string, unknown>) => [...sessionKeys.lists(), params] as const,
  details: () => [...sessionKeys.all(), "detail"] as const,
  detail: (sessionId: string) => [...sessionKeys.details(), sessionId] as const,
  active: () => [...sessionKeys.all(), "active"] as const,
};

// Governance query keys (faculties & departments)
export const governanceKeys = {
  all: () => ["governance"] as const,
  
  // Faculties
  faculties: () => [...governanceKeys.all(), "faculties"] as const,
  facultyList: (params?: Record<string, unknown>) => [...governanceKeys.faculties(), "list", params] as const,
  faculty: (facultyId: string) => [...governanceKeys.faculties(), facultyId] as const,
  facultyByCode: (code: string) => [...governanceKeys.faculties(), "by-code", code] as const,
  
  // Departments
  departments: () => [...governanceKeys.all(), "departments"] as const,
  departmentStats: () => [...governanceKeys.departments(), "stats"] as const,
  departmentList: (params?: Record<string, unknown>) => [...governanceKeys.departments(), "list", params] as const,
  department: (departmentId: string) => [...governanceKeys.departments(), departmentId] as const,
  departmentByCode: (code: string) => [...governanceKeys.departments(), "by-code", code] as const,
};
