import { Request } from 'express';
import { verifyToken, JWTPayload } from '../utils/jwt';

export interface AuthContext {
  user?: JWTPayload;
  isAuthenticated: boolean;
}


export const getAuthContext = (req: Request): AuthContext => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return { isAuthenticated: false };
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return { isAuthenticated: false };
  }

  const token = parts[1];


  const decoded = verifyToken(token);

  if (!decoded) {
    return { isAuthenticated: false };
  }

  return {
    user: decoded,
    isAuthenticated: true
  };
};


export const requireAuth = (context: AuthContext): void => {
  if (!context.isAuthenticated || !context.user) {
    throw new Error('Non authentifié. Veuillez vous connecter.');
  }
};


export const requireAdmin = (context: AuthContext): void => {
  requireAuth(context);

  if (context.user?.role !== 'ADMIN') {
    throw new Error('Accès refusé. Droits administrateur requis.');
  }
};


export const requireRole = (context: AuthContext, roles: string[]): void => {
  requireAuth(context);

  if (!context.user || !roles.includes(context.user.role)) {
    throw new Error(`Accès refusé. Rôles requis: ${roles.join(', ')}`);
  }
};