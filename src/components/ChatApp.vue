<template>
  <div class="flex items-center justify-center p-4 relative">
    <button
      @click="sendNotification"
      title="Send a notification to all users"
      class="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 bg-indigo-600 text-white cursor-pointer px-4 py-2 rounded-full shadow hover:bg-indigo-500 transition items-center gap-2"
    >
      📣 Notify All Users
    </button>

    <div
      class="w-full max-w-md bg-[#1e293b] text-white rounded-2xl shadow-xl flex flex-col h-[90vh] border border-slate-700"
    >
      <ChatHeader
        :user="user"
        :users="onlineUsers"
        @editName="editName"
        @updateMessageTo="setMessageTo"
      />
      <OnlineUsers :users="onlineUsers" />
      <ChatMessages :messages="messages" :currentUser="user" ref="chatBox" />
      <TypingIndicator :typingUsers="typingUsers" />
      <ChatInput v-model="message" @typing="onTyping" @send="sendMessage" />
    </div>
  </div>
</template>


<script>
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

import ChatHeader from "@/components/elements/ChatHeader.vue";
import OnlineUsers from "@/components/elements/OnlineUsers.vue";
import ChatMessages from "@/components/elements/ChatMessages.vue";
import TypingIndicator from "@/components/elements/TypingIndicator.vue";
import ChatInput from "@/components/elements/ChatInput.vue";

import { createSocket } from "@/services/socket";

export default {
  components: {
    ChatHeader,
    OnlineUsers,
    ChatMessages,
    TypingIndicator,
    ChatInput,
  },

  data() {
    return {
      socket: null,
      // role: "agent",
      role: "user",
      messageTo: localStorage.getItem("message_to") || "all",
      // messageTo: "all",
      user: { id: "", name: "" },
      message: "",
      messages: [],
      onlineUsers: [],
      typingUsers: {},
      typingTimeout: null,
    };
  },

  methods: {
    sendMessage(content) {
      const trimmed = content.trim();
      if (!trimmed) return;

      const newMessage = {
        time: new Date(),
        text: trimmed,
        user: this.user,
      };

      this.socket.emit("message", {
        to: this.messageTo,
        event: "demo_chat",
        message: newMessage,
      });

      this.message = "";
      this.messages.push(newMessage);
      this.socket.emit("stop_typing");
      this.scrollToBottom();
    },

    setMessageTo(userId) {
      this.messageTo = userId;
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
      this.socket = createSocket({
        role: this.role,
        userId: this.user.id,
        userName: this.user.name,
        room: "DEMO_CHAT_ROOM",
      });

      this.socket.on("demo_chat", (data) => {
        if (!data?.message) return;
        if (!data?.message?.user) return;
        if (data?.message?.user?.id !== this.user.id) {
          this.messages.push(data.message);
          this.scrollToBottom();

          if (document.hidden) {
            this.showBrowserNotification(data.message);
          }
        }
      });

      this.socket.on("online_users", (users) => {
        this.onlineUsers = users.filter((u) => u.userId !== this.user.id);
      });

      this.socket.on("user_typing", (data) => {
        this.typingUsers[data.userId] = data.userName;
      });

      this.socket.on("user_stop_typing", (data) => {
        delete this.typingUsers[data.userId];
      });

      this.socket.connect();
    },

    reconnectSocket() {
      if (this.socket) {
        this.socket.disconnect();
      }
      this.connectSocket();
    },

    onTyping() {
      if (!this.user.id) return;

      this.socket.emit("typing", {
        userId: this.user.id,
        userName: this.user.name,
      });

      clearTimeout(this.typingTimeout);
      this.typingTimeout = setTimeout(() => {
        this.socket.emit("stop_typing", { userId: this.user.id });
      }, 500);
    },

    showBrowserNotification(message) {
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("💬 New Message", {
          body: `${message.user.name}: ${message.text}`,
          icon: "/chat.png",
        });
      }
    },

    scrollToBottom() {
      this.$nextTick(() => {
        this.$refs.chatBox?.$el?.scrollTo({
          top: this.$refs.chatBox.$el.scrollHeight,
          behavior: "smooth",
        });
      });
    },

    generateId() {
      return "client-" + Math.random().toString(36).substr(2, 9);
    },

    generateName() {
      const animals = ["Lion", "Eagle", "Tiger", "Wolf", "Shark", "Bear"];
      return (
        animals[Math.floor(Math.random() * animals.length)] +
        "-" +
        Math.floor(Math.random() * 1000)
      );
    },

    sendNotification() {
      if (
        confirm("Are you sure you want to send a notification to all users?")
      ) {
        this.socket.emit("message", {
          to: "all",
          event: "demo_notify",
          message: {
            text: " Hey everyone!",
            user: this.user.name,
          },
        });
      }
    },
  },

  mounted() {
    this.initializeUser();
    this.connectSocket();

    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    this.socket.on("demo_notify", (data) => {
      if (data.message && data.message?.text) {
        iziToast.info({
          title: `${data?.message?.user} says:`,
          message: data?.message?.text,
          timeout: 5000,
          displayMode: 2,
          position: "topRight",
        });
      }
    });
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
