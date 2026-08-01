<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppLayout from './components/AppLayout.vue'
import LoginView from './views/LoginView.vue'

const route = useRoute()
const isLogin = computed(() => route.path === '/login')
</script>

<template>
  <LoginView v-if="isLogin" />
  <AppLayout v-else />
</template>
