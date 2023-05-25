<template>
  <div v-for="msg in messages" :key="msg.time" :class="['message', msg.sender]">
    <div>
      <img :src="img" />
    </div>
    <div>
      <span>{{ msg.time }}</span>
      <span>{{ msg.text }}</span>
    </div>
  </div>
</template>

<script>
import { METHODS } from "http";

export default {
  name: "MessageBox",
  props: {
    img: String,
    time: String,
    text: String,
  },
  data() {
    return {
      messages: [],
    };
  },
  methods: {
    send() {
      if (this.input) {
        this.messages.push({
          time: Date.now(),
          text: input,
          img: "",
          sender: user,
        });
      }
      this.input = "";
      this.toggleSender();
    },
    toggleSender() {
      this.sender = this.sender === "me" ? "you" : "me";
    },
  },
};
</script>
