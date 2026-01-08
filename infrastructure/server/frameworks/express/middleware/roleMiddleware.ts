import { Request, Response, NextFunction } from "express";
import { RoleEnum } from "../../../../../domain/enums/RoleEnum";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        roles: RoleEnum[];
      };
    }
  }
}

export const authorizeRoles = (allowedRoles: RoleEnum[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    console.log(' Role Check:', {
      userRoles: req.user.roles,
      allowedRoles: allowedRoles,
      userId: req.user.userId
    });

    const hasAllowedRole = req.user.roles.some(role => allowedRoles.includes(role));

    if (!hasAllowedRole) {
      console.log(' Access denied - User roles:', req.user.roles, 'Required roles:', allowedRoles);
      return res.status(403).json({ message: "Access forbidden: insufficient permissions" });
    }

    console.log('Access granted');
    next();
  };
};