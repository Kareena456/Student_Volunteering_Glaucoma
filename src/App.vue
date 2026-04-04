<script setup>
import NavBar from "./components/NavBar.vue"
import GlaucomaChat from "./components/chatbot.vue"
</script>

<template>
  <NavBar />
  <router-view />
  <GlaucomaChat />
</template>

<style>
body {
  margin: 0;
  background-color: #f8fafc;
  color: #0f172a;
  font-family: system-ui, -apple-system, sans-serif;
}
</style>