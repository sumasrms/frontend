import type { User, UserRole } from "./index";

export interface AdminUser extends User {
  role: UserRole;
  isBanned: boolean;
  banReason?: string;
  banExpiresAt?: Date;
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface BanUserInput {
  userId: string;
  reason?: string;
  expiresAt?: Date;
}

export interface AdminStats {
  users: {
    total: number;
    students: number;
    staff: number;
  };
  academic: {
    faculties: number;
    departments: number;
    courses: number;
  };
  currentSession: string;
  pendingResults: number;
  recentPayments: number;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  user?: User;
}

export interface AuditLogFilters {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface AdminUserFilters {
  role?: UserRole;
}
