<template>
  <div
    class="bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-t-2xl p-3 text-center border-b border-slate-700 shadow-md relative"
  >
    <!-- App Name -->
    <h2
      class="text-2xl font-extrabold tracking-wide text-indigo-400 drop-shadow-lg mb-1"
    >
      💬 {{ appName }}
    </h2>

    <!-- Current User Info -->
    <div class="text-sm text-slate-400 flex justify-center items-center gap-2">
      <span
        >Name: <strong class="text-indigo-300">{{ user.name }}</strong></span
      >
      <button
        @click="$emit('editName')"
        class="text-indigo-400 hover:text-indigo-300 text-base"
        title="Edit your name"
      >
        ✏️
      </button>
    </div>

    <!-- Divider -->
    <div class="mt-2 mb-4 h-px bg-slate-600 w-full"></div>

    <!-- Select Message Receiver -->
    <div class="flex flex-col items-center gap-1">
      <label
        class="text-slate-400 text-xs uppercase tracking-wide font-semibold"
      >
        Send Message To
      </label>
      <select
        v-model="selectedUserId"
        @change="updateMessageTo"
        class="w-full max-w-xs bg-slate-700 text-white rounded-full px-4 py-2 text-sm border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        <option value="all">🌍 All Users</option>
        <option v-for="user in users" :key="user.userId" :value="user.userId">
          👤 {{ user.userName }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
    users: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      appName: import.meta.env.VITE_APP_NAME,
      selectedUserId: "all",
    };
  },

  methods: {
    updateMessageTo() {
      localStorage.setItem("message_to", this.selectedUserId);
      this.$emit("updateMessageTo", this.selectedUserId);
    },
  },

  mounted() {
    const message_to = localStorage.getItem("message_to");
    if (message_to) {
      this.selectedUserId = message_to;
    }
  },
};
</script>
