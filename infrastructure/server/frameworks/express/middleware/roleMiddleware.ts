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

    const hasAllowedRole = req.user.roles.some(role => allowedRoles.includes(role));

    if (!hasAllowedRole) {
      return res.status(403).json({ message: "Access forbidden: insufficient permissions" });
    }

    next();
  };
};