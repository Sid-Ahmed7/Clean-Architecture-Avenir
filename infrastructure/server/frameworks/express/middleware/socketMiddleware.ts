import { Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";
import cookie from "cookie";

interface SocketUser {
  userId: string;
  roles: string[];
}

export const socketMiddleware = (socket: Socket, next: (err?: any) => void) => {
  try {
    const cookies = cookie.parse(socket.handshake.headers.cookie || "");
    const token = cookies.accessToken || socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const secret = process.env.JWT_SECRET!;
    const decoded = jwt.verify(token, secret) as JwtPayload & { sub: string; roles: string[] };

 socket.data.user = {
      userId: decoded.sub,
      role: decoded.roles[0]
    };
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
};
