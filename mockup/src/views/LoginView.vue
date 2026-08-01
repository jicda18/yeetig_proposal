<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from '@lucide/vue'

const router = useRouter()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

function handleSubmit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Please enter your email address and password.'
    return
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
    router.push('/')
  }, 800)
}
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
    <!-- Background gradient effects -->
    <div class="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
    <div class="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-3xl" />

    <div class="relative w-full max-w-md">
      <!-- Logo -->
      <div class="mb-8 flex flex-col items-center">
        <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
          <span class="text-2xl font-bold text-white">Y</span>
        </div>
        <h1 class="mt-4 text-2xl font-bold text-white">Yeetiq Partner Portal</h1>
        <p class="mt-1 text-sm text-slate-400">Sign in to access your dashboard</p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <!-- Demo credentials hint -->
        <div class="mb-5 flex items-center gap-2 rounded-xl border border-indigo-400/20 bg-indigo-500/10 px-4 py-3">
          <span class="h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0" />
          <p class="text-xs text-indigo-300">
            <span class="font-semibold">Demo credentials:</span> admin@yeetiq.com / any password
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-5">
          <!-- Error alert -->
          <transition
            enter-active-class="transition-all duration-300"
            leave-active-class="transition-all duration-200"
            enter-from-class="opacity-0 -translate-y-2"
            leave-to-class="opacity-0"
          >
            <div
              v-if="error"
              class="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
            >
              <span class="h-1.5 w-1.5 rounded-full bg-rose-400" />
              {{ error }}
            </div>
          </transition>

          <!-- Email -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-300">Email address</label>
            <div class="relative">
              <Mail class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                v-model="email"
                type="email"
                placeholder="admin@yeetiq.com"
                class="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition-all focus:border-indigo-400/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          <!-- Password -->
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-300">Password</label>
            <div class="relative">
              <Lock class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder-slate-500 transition-all focus:border-indigo-400/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                type="button"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-200"
                @click="showPassword = !showPassword"
              >
                <Eye v-if="!showPassword" class="h-4 w-4" />
                <EyeOff v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Remember + forgot -->
          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 text-sm text-slate-300 cursor-pointer select-none">
              <input type="checkbox" class="h-4 w-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/30" />
              Remember me
            </label>
            <button type="button" class="text-sm font-medium text-indigo-400 hover:text-indigo-300">
              Forgot password?
            </button>
          </div>

          <!-- Submit -->
          <button
            type="submit"
            :disabled="loading"
            class="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:shadow-indigo-500/50 active:scale-[0.98] disabled:opacity-60"
          >
            <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            <template v-else>
              Sign In
              <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </template>
          </button>
        </form>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-3">
          <div class="h-px flex-1 bg-white/10" />
          <span class="text-xs text-slate-500">or</span>
          <div class="h-px flex-1 bg-white/10" />
        </div>

        <!-- Sign up link -->
        <p class="text-center text-sm text-slate-400">
          Don't have an account?
          <button class="font-semibold text-indigo-400 hover:text-indigo-300">Request access</button>
        </p>
      </div>

      <p class="mt-6 text-center text-xs text-slate-500">
        © 2024 Yeetiq. All rights reserved.
      </p>
    </div>
  </div>
</template>
