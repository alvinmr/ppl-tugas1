<template>
  <Navbar :user="user" />
  <NuxtPage />
</template>

<script setup>
const user = useAuthStore()

</script>