import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase/config';

export type UserRole = 'admin' | 'user';

export interface UserPermissions {
  role: UserRole;
  canManageUsers: boolean;
  canViewReports: boolean;
  canManageSettings: boolean;
}

const DEFAULT_PERMISSIONS: UserPermissions = {
  role: 'user',
  canManageUsers: false,
  canViewReports: false,
  canManageSettings: false,
};

const ADMIN_PERMISSIONS: UserPermissions = {
  role: 'admin',
  canManageUsers: true,
  canViewReports: true,
  canManageSettings: true,
};

export async function getUserPermissions(user: User | null): Promise<UserPermissions> {
  if (!user) {
    return DEFAULT_PERMISSIONS;
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      return DEFAULT_PERMISSIONS;
    }

    const userData = userDoc.data();
    if (userData.role === 'admin') {
      return ADMIN_PERMISSIONS;
    }

    return {
      ...DEFAULT_PERMISSIONS,
      role: userData.role as UserRole,
    };
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return DEFAULT_PERMISSIONS;
  }
}

export function hasPermission(permissions: UserPermissions, permission: keyof UserPermissions): boolean {
  return !!permissions[permission];
}

export const PROTECTED_ROUTES = {
  '/users': 'canManageUsers',
  '/reports': 'canViewReports',
  '/settings': 'canManageSettings',
} as const; 