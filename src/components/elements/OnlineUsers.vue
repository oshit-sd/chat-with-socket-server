<template>
  <div
    class="px-4 py-2 text-xs text-slate-400 border-b border-slate-600 bg-[#0f172a]"
  >
    <span class="font-semibold text-slate-300">Online: </span>
    <span v-for="(u, idx) in users" :key="u.userId" class="mr-2">
      <span class="text-green-500">🟢</span> {{ u.userName }}
      <span v-if="idx !== users.length - 1">|</span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    users: Array,
  },
};
</script>
