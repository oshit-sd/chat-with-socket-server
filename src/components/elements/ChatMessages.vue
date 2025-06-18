<template>
  <div
    ref="chatBox"
    class="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-[#1e293b]"
  >
    <div
      v-for="(msg, index) in messages"
      :key="index"
      class="flex"
      :class="msg?.user.id === currentUser.id ? 'justify-end' : 'justify-start'"
    >
      <div
        class="max-w-[75%] px-4 py-2 rounded-xl text-sm shadow-md"
        :class="
          msg?.user?.id === currentUser.id
            ? 'bg-indigo-800 text-white rounded-br-none'
            : 'bg-slate-600 text-white rounded-bl-none'
        "
      >
        <p>{{ msg.text }}</p>
        <span
          v-if="msg.user"
          class="block text-xs mt-1 text-right text-slate-300"
        >
          {{ msg.user.id === currentUser.id ? "You" : msg.user.name }}
          • {{ formatTime(msg.time) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    messages: Array,
    currentUser: Object,
  },
  methods: {
    formatTime(date) {
      return new Date(date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    },
  },
};
</script>
