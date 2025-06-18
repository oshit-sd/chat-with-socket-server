# 📦 Vue Chat App with Socket.IO

This project is a real-time chat application built with Vue.js and powered by a custom Socket.IO server. It supports messaging, typing indicators, browser notifications, and a broadcast feature for users to notify all connected clients.

---

## 🚀 Features

* 🔒 Authenticated WebSocket connection using API keys
* 💬 Real-time messaging between users
* ✍️ Typing indicators
* 🟢 Online user tracking
* 🔔 Browser notifications for incoming messages
* 📣 Any user can send a global broadcast notification
* 🎨 Fully responsive and styled with Tailwind CSS


---

## ⚙️ Environment Variables

Create a `.env` file in your project root:

```env
VITE_SOCKET_URL=https://your-socket-server.com
VITE_SOCKET_API_KEY=your-secure-api-key
```

These are required to authenticate the socket connection.

---

## 🧠 How It Works

### ⚡ Socket Initialization

The socket is initialized using the `createSocket()` function, which authenticates and establishes a WebSocket connection.

#### Parameters:

* **`userId`**:
  A unique identifier for each connected client (e.g., `client-abc123`).

* **`userName`**:
  The display name shown in the chat interface.

* **`room`**:
  A unique room name where users can join and exchange messages. Users in the same room can communicate in real time.

* **`role`**:
  Defines the behavior and access level of the connected client. Supported roles:

  * **`user`**
    The default role for general users. Capabilities include:

    * Sending and receiving messages
    * Broadcasting typing indicators
    * Receiving global notifications

  * **`agent`**
    A special role for support personnel, moderators, or admins. Commonly used in one-to-many or few-to-many support models. Capabilities include:

    * Responding to multiple users simultaneously
    * Viewing or handling private/direct messages (server-side logic dependent)
    * Acting as dedicated support agents

#### Example:

```js
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
        alert(`Socket error: ${err.message}`);
    });

    socket.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err.message);
    });

    socket.on("connect", () => {
        console.log("✅ Connected to socket server");
    });

    return socket;
}

this.socket = createSocket({
  room:'chat-room'
  userId: this.user.id,
  userName: this.user.name,
});
```

---

### Events Handled

| Event Name         | Triggered By | Description                                      |
| ------------------ | ------------ | ------------------------------------------------ |
| `VUE_MESSAGE`      | All users    | Real-time messaging to specific users or all     |
| `VUE_NOTIFY`       | Any user     | Broadcasts a notification to all connected users |
| `online_users`     | Server       | Provides the list of currently connected users   |
| `user_typing`      | Other users  | Shows who is typing                              |
| `user_stop_typing` | Other users  | Removes typing indicator                         |

---

## 🛠 Developer Instructions

### 1. Run the App

```bash
npm install
npm run dev
```

### 2. Change Display Name

Click the **Edit Name** option in the header to update your display name. This reconnects the socket using the new info.

### 3. Send a Global Notification

Click the **📣 Notify All Users** button to broadcast a message to everyone (not limited to admins).

### 4. Typing Detection

Typing is emitted during input. If inactive for 500ms, a stop event is sent.

---

## 🔔 Notifications

When the app is not focused (tab is inactive), browser notifications alert users of new messages. Permission is requested on mount.

---

## 🧪 Testing

To simulate multiple users:

* Open multiple tabs or browsers
* Each session gets a unique user ID and random name
* User data is stored in `localStorage`

---

## 📁 Key Files

| File                                    | Responsibility                |
| --------------------------------------- | ----------------------------- |
| `ChatApp.vue`                           | Main UI and socket logic      |
| `socket.js`                             | Creates the socket connection |
| `ChatHeader.vue`, `OnlineUsers.vue`, `ChatMessages.vue`, `TypingIndicator.vue`, `ChatInput.vue`. | UI Components                 |

---

## 🧳 Future Ideas

* Persist chat history with a backend or Firebase
* User-to-user private chat UI
* Emoji picker and media support
* Avatars and color indicators for users

---

## 👨‍💻 Author

Built with ❤️ by [**Oshit Sutra Dar**](https://github.com/oshit-sd)

* 🧑‍💻 Software Engineer
* 🌐 GitHub: [github.com/oshit-sd](https://github.com/oshit-sd)
* 📑 Portfolio: [oshit-sd.github.io](https://oshit-sd.github.io/)
* 🌍 Project: [Chat App](https://oshit-sd-chat-app.vercel.app/)
