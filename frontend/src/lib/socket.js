import { io } from "socket.io-client";

let Socket = null;

export const connectSocket = (userId) => {
    Socket = io(import.meta.env.VITE_SOCKET_URL || "/", {
        query: { userId },
        withCredentials: true,
    });

    return Socket;
};

export const getSocket = () => Socket;

export const disconnectSocket = () => {
    if (Socket) {
        Socket.disconnect();
        Socket = null;
    }
};