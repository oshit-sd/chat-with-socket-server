<template>
  <div
    class="p-4 bg-[#0f172a] border-t border-slate-600 flex items-center gap-2"
  >
    <input
      :value="modelValue"
      @input="onInput"
      @keyup.enter="onSend"
      type="text"
      placeholder="Type your message..."
      class="flex-1 px-4 py-2 rounded-full bg-slate-700 text-white text-sm border border-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    />
    <button
      @click="onSend"
      class="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium cursor-pointer"
    >
      Send
    </button>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: true,
    },
  },
  methods: {
    onInput(event) {
      this.$emit("update:modelValue", event.target.value);
      this.$emit("typing");
    },
    onSend() {
      this.$emit("send", this.modelValue);
    },
  },
};
</script>
