import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AuthController } from "../frameworks/express/controller/AuthController";
import { 
  authenticateJWT, 
  authorizeDirector, 
  authorizeClient, 
  authorizeRoles,
  verifyRefreshTokenCookie
} from "../frameworks/express/middleware/authMiddleware";
import { RoleEnum } from "../../../domain/enums/RoleEnum";

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Controllers
const authController = new AuthController();

// Public routes
app.post("/api/auth/register", (req: Request, res: Response) => authController.register(req, res));
app.post("/api/auth/login", (req: Request, res: Response) => authController.login(req, res));
app.post("/api/auth/logout", (req: Request, res: Response) => authController.logout(req, res));

// Refresh token route - requires refresh token cookie
app.post("/api/auth/refresh", verifyRefreshTokenCookie, (req: Request, res: Response) => authController.refresh(req, res));

// Health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

// Protected routes examples
// Client-only route
app.get("/api/client/profile", authenticateJWT, authorizeClient, (req: Request, res: Response) => {
  res.status(200).json({ 
    message: "Client profile accessed successfully",
    userId: req.user?.userId
  });
});

// Director-only route
app.get("/api/director/dashboard", authenticateJWT, authorizeDirector, (req: Request, res: Response) => {
  res.status(200).json({ 
    message: "Director dashboard accessed successfully",
    userId: req.user?.userId
  });
});

// Multi-role route (accessible by both directors and admins)
app.get(
  "/api/management/users", 
  authenticateJWT, 
  authorizeRoles([RoleEnum.BANK_MANAGER, RoleEnum.ADMIN]), 
  (req: Request, res: Response) => {
    res.status(200).json({ 
      message: "User management accessed successfully",
      userId: req.user?.userId,
      roles: req.user?.roles
    });
  }
);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
