<template>
  <div
    class="px-4 py-2 text-xs text-slate-400 border-b border-slate-600 bg-[#0f172a]"
  >
    <span class="font-semibold text-slate-300 mr-2"
      >Online ({{ users.length }}):</span
    >
    <template v-if="users.length > 0">
      <span v-for="(u, idx) in users.slice(0, 10)" :key="u.userId">
        <span class="text-green-500">🟢</span> {{ u.userName }}
        <span v-if="idx !== users.length - 1" class="mx-1 text-slate-500"
          >|</span
        >
      </span>
    </template>
    <span v-else class="text-slate-500 uppercase">no active users</span>
  </div>
</template>

<script>
export default {
  props: {
    users: Array,
  },
};
</script>
