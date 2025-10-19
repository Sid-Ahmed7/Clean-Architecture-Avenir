import {Socket} from "socket.io";
import jwt from "jsonwebtoken";

export const socketMiddleware = (socket : Socket, next:(err?: any) => void ) => {
    const secret = process.env.JWT_SECRET!;

    try {
    const token = socket.handshake.auth?.token;
    const decoded = jwt.verify(token, secret);
    socket.data.user = decoded;
    next();
    } catch(err) {
        next(new Error("Unauthorized"));
    }

}