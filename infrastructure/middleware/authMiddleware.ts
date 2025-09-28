import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { RoleEnum } from "../../domain/enums/RoleEnum";

// JWT secret should be in environment variables in production
const JWT_SECRET = "your-secret-key";

// Define a custom interface for the Request object with user property
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

// Middleware to verify JWT token
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // First check if token is defined
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    // Use a safer type assertion approach
    const decoded = jwt.verify(token, JWT_SECRET);

    // Validate the decoded token has the expected structure
    if (typeof decoded === 'object' && decoded !== null && 
        'sub' in decoded && 'roles' in decoded) {
      req.user = {
        userId: decoded.sub as string,
        roles: decoded.roles as RoleEnum[]
      };
    } else {
      return res.status(401).json({ message: "Invalid token format" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Middleware to check if user has required roles
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

// Middleware specifically for director access
export const authorizeDirector = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!req.user.roles.includes(RoleEnum.BANK_MANAGER)) {
    return res.status(403).json({ message: "Access forbidden: director permissions required" });
  }

  next();
};

// Middleware specifically for client access
export const authorizeClient = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!req.user.roles.includes(RoleEnum.CLIENT)) {
    return res.status(403).json({ message: "Access forbidden: client permissions required" });
  }

  next();
};
