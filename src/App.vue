<!--
  App.vue is the root component that wraps the entire application
  Shows the navbar and chatbot on every page
  The router view renders whichever page the user is currently on
-->
<script setup>
import NavBar from "./components/NavBar.vue"
import GlaucomaChat from "./components/chatbot.vue"
</script>

<template>

  <NavBar />
 
  <router-view />
  <!-- Floating chatbot shown on every page -->
  <GlaucomaChat />
</template>

<style>
/* Global styles applied to the whole app */
body {
  margin: 0;
  background-color: #f8fafc;
  color: #0f172a;
  font-family: system-ui, -apple-system, sans-serif;
}
</style>