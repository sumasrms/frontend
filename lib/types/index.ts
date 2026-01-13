// Common types
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  role?: UserRole;
  firstName?: string;
  lastName?: string;
  surname?: string;
  phoneNumber?: string | null;
  isActive?: boolean;
  departmentId?: string | null;
  facultyId?: string | null;
  staffId?: string | null;
  studentId?: string | null;
  lastLogin?: string | null;
  twoFactorEnabled?: boolean;
}

export type UserRole = "ADMIN" | "STAFF" | "STUDENT" | "FACULTY_DEAN" | "HOD" | "SENATE" | "LECTURER" | "NON_TEACHING_STAFF" | "admin" | "staff" | "student";

// Faculty types
export interface Faculty {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  deanId?: string | null;
  dean?: User | null;
  departments?: Department[];
  users?: User[];
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: {
    departments: number;
    users: number;
  };
}

export interface CreateFacultyInput {
  name: string;
  code: string;
  description?: string;
  deanId?: string;
}

export interface UpdateFacultyInput {
  name?: string;
  code?: string;
  description?: string;
  deanId?: string | null;
}

// Department types
export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  facultyId: string;
  hodId?: string | null;
  numberOfYears?: number;
  faculty?: Faculty;
  hod?: User | null;
  gradeScales?: GradeScale[];
  createdAt: Date | string;
  updatedAt: Date | string;
  _count?: {
    courses: number;
    students: number;
    staff: number;
  };
  courses?: Course[];
  levels?: Level[];
}

export interface DepartmentStats {
  total: number;
  withHod: number;
  withoutHod: number;
}

export interface CreateDepartmentInput {
  name: string;
  code: string;
  description?: string;
  facultyId: string;
  headId?: string;
  numberOfYears?: number;
  hodId?: string;
}

export interface UpdateDepartmentInput {
  name?: string;
  code?: string;
  description?: string;
  facultyId?: string;
  headId?: string | null;
  numberOfYears?: number;
  hodId?: string;
}

export interface GradeScale {
  id: string;
  grade: string;
  minScore: number;
  maxScore: number;
  gradePoint: number;
  description?: string;
  departmentId: string;
}

export interface CreateGradeScaleInput {
  grade: string;
  minScore: number;
  maxScore: number;
  gradePoint: number;
  description?: string;
}

// Level types
export interface Level {
  id: string;
  name: string;
  value: number;
  departmentId: string;
}

// Student types
export interface Student {
  id: string;
  userId: string;
  matricNumber: string;
  department: string;
  faculty: string;
  level: number;
  cgpa?: number;
  user?: User;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateStudentInput {
  userId: string;
  matricNumber: string;
  department: string;
  faculty: string;
  level: number;
}

export interface UpdateStudentInput {
  department?: string;
  faculty?: string;
  level?: number;
  cgpa?: number;
}

// Staff types
export interface Staff {
  id: string;
  userId: string;
  staffId: string;
  department: string;
  faculty: string;
  position: string;
  user?: User;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateStaffInput {
  userId: string;
  staffId: string;
  department: string;
  faculty: string;
  position: string;
}

export interface UpdateStaffInput {
  department?: string;
  faculty?: string;
  position?: string;
}

// Course types
export interface Course {
  id: string;
  code: string;
  title: string;
  creditUnits: number;
  department: string;
  faculty: string;
  level: number;
  semester: 1 | 2;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateCourseInput {
  code: string;
  title: string;
  creditUnits: number;
  department: string;
  faculty: string;
  level: number;
  semester: 1 | 2;
}

export interface UpdateCourseInput {
  code?: string;
  title?: string;
  creditUnits?: number;
  department?: string;
  faculty?: string;
  level?: number;
  semester?: 1 | 2;
}

// Academic Session types
export interface AcademicSession {
  id: string;
  label: string;
  startDate: Date | string;
  endDate: Date | string;
  isActive: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateAcademicSessionInput {
  label: string;
  startDate: Date | string;
  endDate: Date | string;
  isActive?: boolean;
}

// Result types
export interface Result {
  id: string;
  studentId: string;
  courseId: string;
  sessionId: string;
  score: number;
  grade: string;
  gradePoint: number;
  student?: Student;
  course?: Course;
  session?: AcademicSession;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CreateResultInput {
  studentId: string;
  courseId: string;
  sessionId: string;
  score: number;
}

export interface UpdateResultInput {
  score?: number;
}
