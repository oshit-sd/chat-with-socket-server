<template>
  <div class="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
    <div
      class="w-full max-w-md bg-[#1e293b] text-white rounded-2xl shadow-xl flex flex-col h-[90vh] border border-slate-700"
    >
      <!-- Header -->
      <div
        class="bg-[#1e293b] p-4 text-center border-b border-slate-600 relative"
      >
        <h2 class="text-lg font-bold tracking-wide text-indigo-400 drop-shadow">
          💬 Realtime Chat
        </h2>
        <div
          class="text-xs text-slate-400 flex justify-center items-center gap-1 mt-1"
        >
          <span>Name: {{ user.name }}</span>
          <button
            @click="editName"
            class="text-indigo-400 hover:text-indigo-300"
          >
            ✏️
          </button>
        </div>
      </div>

      <!-- 🟢 Online Users List -->
      <div
        class="px-4 py-2 text-xs text-slate-400 border-b border-slate-600 bg-[#0f172a]"
      >
        <span class="font-semibold text-slate-300">Online: </span>
        <span v-for="(u, idx) in onlineUsers" :key="idx" class="mr-2">
          <span class="text-green-500">🟢</span> {{ u.userName }} &nbsp;
          <span v-if="idx !== onlineUsers.length - 1">|</span>
        </span>
      </div>

      <!-- Chat Messages -->
      <div
        ref="chatBox"
        class="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-[#1e293b]"
      >
        <div
          v-for="(msg, index) in messages"
          :key="index"
          class="flex"
          :class="msg?.user.id === user.id ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-[75%] px-4 py-2 rounded-xl text-sm shadow-md"
            :class="
              msg?.user.id === user.id
                ? 'bg-indigo-800 text-white rounded-br-none'
                : 'bg-slate-600 text-white rounded-bl-none'
            "
          >
            <p>{{ msg.text }}</p>
            <span class="block text-xs mt-1 text-right text-slate-300">
              {{ msg?.user.id === user.id ? "You •" : msg?.user.name }}
              {{ formatTime(msg.time) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Typing Indicator (Below Chat Messages) -->
      <div
        v-if="Object.keys(typingUsers).length"
        class="text-xs text-slate-400 px-4 pb-2"
      >
        <span
          v-for="([userId, userName], idx) in Object.entries(typingUsers)"
          :key="userId"
        >
          {{ userName }} is typing...
          <span v-if="idx !== Object.entries(typingUsers).length - 1">, </span>
        </span>
      </div>

      <!-- Input Area -->
      <div
        class="p-4 bg-[#0f172a] border-t border-slate-600 flex items-center gap-2"
      >
        <input
          v-model="message"
          @input="onTyping"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type your message..."
          class="flex-1 px-4 py-2 rounded-full bg-slate-700 text-white text-sm border border-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          @click="sendMessage"
          class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
      apiKey: "riseuplabs123",
      user: {
        id: "",
        name: "",
      },
      message: "",
      messages: [],
      onlineUsers: [],
      typingTimeout: null,
      typingUsers: {},
    };
  },

  methods: {
    sendMessage() {
      const trimmed = this.message.trim();
      if (!trimmed) return;

      const msg = {
        time: new Date(),
        text: trimmed,
        user: this.user,
      };

      const message_to = localStorage.getItem("message_to");

      this.socket.emit("message", {
        // to: "all",
        to: message_to || "all",
        event: "VUE_MESSAGE",
        message: msg,
      });

      this.message = "";
      this.socket.emit("stop_typing");
      this.messages.push(msg);
      this.scrollToBottom();
    },

    editName() {
      const newName = prompt("Enter your display name:", this.user.name);
      if (newName?.trim()) {
        this.user.name = newName.trim();
        this.saveUser();
        this.reconnectSocket();
      }
    },

    initializeUser() {
      const stored = localStorage.getItem("chat_user_info");
      if (stored) {
        this.user = JSON.parse(stored);
      } else {
        this.user = {
          id: this.generateId(),
          name: this.generateName(),
        };
        this.saveUser();
      }
    },

    saveUser() {
      localStorage.setItem("chat_user_info", JSON.stringify(this.user));
    },

    connectSocket() {
      // const socket = io("ws://172.16.1.123:82", {
      // const socket = io("ws://socket.brighthomeltd.com", {
      const socket = io("ws://192.168.10.157:3001", {
        auth: {
          apiKey: this.apiKey,
          userId: this.user.id,
          userName: this.user.name,
        },
        query: {
          clientId: this.user.id,
        },
        autoConnect: false,
      });

      socket.on("connect_error", (err) => {
        console.error("❌ Socket connection error:", err.message);
      });

      socket.on("connect", () => {
        console.log("✅ Connected to socket server");
      });

      socket.on("VUE_MESSAGE", (data) => {
        if (data?.message?.user?.id === this.user.id) {
          return;
        }
        this.messages.push(data.message);
        this.scrollToBottom();
      });

      socket.on("online_users", (users) => {
        this.onlineUsers = users.filter((u) => u.userId !== this.user.id);
      });

      socket.on("user_offline", (userId) => {
        this.onlineUsers = this.onlineUsers.filter((u) => u.userId !== userId);
      });

      socket.on("user_typing", (data) => {
        if (!this.typingUsers[data.userId]) {
          this.typingUsers[data.userId] = data.userName;
        }
      });

      socket.on("user_stop_typing", (data) => {
        delete this.typingUsers[data.userId];
      });

      this.socket = socket;
      this.socket.connect();
    },

    onTyping() {
      if (!this.socket) return;

      this.socket.emit("typing", {
        userId: this.user.id,
        userName: this.user.name,
      });

      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout);
      }

      this.typingTimeout = setTimeout(() => {
        this.socket.emit("stop_typing", { userId: this.user.id });
      }, 500);
    },

    reconnectSocket() {
      if (this.socket) {
        this.socket.disconnect();
      }
      this.connectSocket();
    },

    getUserNameById(userId) {
      const user = this.onlineUsers.find((u) => u.userId === userId);
      return user ? user.userName : null;
    },

    generateId() {
      return "client-" + Math.random().toString(36).slice(2, 9);
    },

    generateName() {
      const animals = ["Lion", "Eagle", "Tiger", "Wolf", "Shark", "Bear"];
      return (
        animals[Math.floor(Math.random() * animals.length)] +
        "-" +
        Math.floor(Math.random() * 1000)
      );
    },

    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.chatBox.scrollTop = this.$refs.chatBox.scrollHeight;
      });
    },

    formatTime(date) {
      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },

  mounted() {
    this.initializeUser();
    this.connectSocket();
  },
};
</script>

<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: #1e293b;
}
::-webkit-scrollbar-thumb {
  background-color: #4c4b5c;
  border-radius: 10px;
}
</style>
