<template>
  <div
    v-if="Object.keys(typingUsers).length"
    class="text-xs text-slate-400 px-4 pb-2"
  >
    <span
      v-for="([userId, userName], idx) in Object.entries(typingUsers)"
      :key="userId"
    >
      {{ userName }} is typing...<span
        v-if="idx !== Object.entries(typingUsers).length - 1"
        >,</span
      >
    </span>
  </div>
</template>

<script>
export default {
  props: {
    typingUsers: Object,
  },
};
</script>
