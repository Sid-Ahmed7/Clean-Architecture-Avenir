import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { RoleEnum } from "../../../../../domain/enums/RoleEnum";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH!;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION;
const JWT_EXPIRATION_REFRESH = process.env.JWT_EXPIRATION_REFRESH;
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

function isJwtPayload(obj: any): obj is { sub: string; roles: RoleEnum[] } {
  return obj && typeof obj === "object" && typeof obj.sub === "string" && Array.isArray(obj.roles);
}

export const verifyTokenAccess = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

   if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({ message: "Authorization header missing or malformed" });
        return;  
    }

  const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

  try {
     const decoded = jwt.verify(token, JWT_SECRET);

    if(!isJwtPayload(decoded)) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    req.user = {
        userId: decoded.sub ,
        roles: decoded.roles
      };
    next();
  } catch (error) {
    if(error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: `Token expired after ${JWT_EXPIRATION}` });

    }
    return res.status(401).json({ message: "Invalid token" });
  }
};


export const verifyRefreshTokenCookie = (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET_REFRESH);

    if (!isJwtPayload(decoded)) {
      return res.status(401).json({ message: "Invalid refresh token format" });
    }

    req.user = {
      userId: decoded.sub,
      roles: decoded.roles
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: `Refresh token expired after ${JWT_EXPIRATION_REFRESH}` });
    }
    return res.status(401).json({ message: "Invalid refresh token" });
  }
};
