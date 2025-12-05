import { config } from "dotenv";
config();
import app from "./app";
import { createServer } from "http";
import {Server} from 'socket.io';
import { socketSetup } from "./sockets/socket";

const httpServer = createServer(app);
const clientBaseUrl = process.env.CLIENT_BASE_URL;
const io = new Server(httpServer, {
    cookie: {
        name: "io",
        path: "/",
        httpOnly: true,
        sameSite: "lax",
    },
    cors: {
        origin: clientBaseUrl,
        credentials: true,
    },
});

socketSetup(io);

httpServer.listen(process.env.PORT, function() {
    console.log("Server started on port " + process.env.PORT)
})