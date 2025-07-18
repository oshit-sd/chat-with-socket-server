import { io } from "socket.io-client";

let socket = null;

export function createSocket({ userId = '', userName = '', room = '', role = 'user' } = {}) {
    const socketUrl = import.meta.env.VITE_SOCKET_URL;
    const apiKey = import.meta.env.VITE_SOCKET_API_KEY;

    if (!socketUrl || !apiKey) {
        throw new Error("VITE_SOCKET_URL or VITE_SOCKET_API_KEY not defined in .env");
    }

    if (socket) {
        socket.disconnect();
        console.warn("⚙️ Previous socket disconnected.");
    }

    socket = io(socketUrl, {
        auth: { apiKey, userId, userName, room, role }
    });

    socket.on("errors", (err) => {
        console.error("❌ Socket error:", err.message);
        alert(`${err.message}`);
    });

    socket.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err.message);
    });

    socket.on("connect", () => {
        console.log("✅ Connected to socket server");
    });

    return socket;
}