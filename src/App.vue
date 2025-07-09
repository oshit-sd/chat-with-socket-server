<template>
  <div class="min-h-screen bg-[#0f172a]">
    <ChatApp />

    <footer class="mt-auto text-center text-sm text-slate-500">
      <span>Powered by: </span>
      <a
        href="https://socket.techcanvas.info"
        target="_blank"
        rel="noopener noreferrer"
        class="text-indigo-400 underline font-bold"
      >
        TechCanvas Socket Server
      </a>
    </footer>
  </div>
</template>

<script>
import ChatApp from "@/components/ChatApp.vue";

export default {
  name: "App",
  components: {
    ChatApp,
  },
};
</script>
