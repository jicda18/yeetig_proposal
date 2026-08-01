<script setup lang="ts">
import { useToast } from '../../composables/useToast'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from '@lucide/vue'

const { toasts, dismiss } = useToast()

const config: Record<string, { icon: typeof Info; bg: string; border: string; iconColor: string; titleColor: string }> = {
  success: { icon: CheckCircle, bg: 'bg-white', border: 'border-emerald-200', iconColor: 'text-emerald-500', titleColor: 'text-slate-900' },
  error: { icon: XCircle, bg: 'bg-white', border: 'border-rose-200', iconColor: 'text-rose-500', titleColor: 'text-slate-900' },
  warning: { icon: AlertTriangle, bg: 'bg-white', border: 'border-amber-200', iconColor: 'text-amber-500', titleColor: 'text-slate-900' },
  info: { icon: Info, bg: 'bg-white', border: 'border-indigo-200', iconColor: 'text-indigo-500', titleColor: 'text-slate-900' },
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-3 px-4 sm:bottom-6 sm:right-6 sm:px-0">
      <transition-group
        enter-active-class="transition-all duration-300"
        leave-active-class="transition-all duration-200"
        enter-from-class="opacity-0 translate-x-8"
        leave-to-class="opacity-0 translate-x-8"
        move-class="transition-transform duration-200"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg"
          :class="config[toast.type].border"
        >
          <component :is="config[toast.type].icon" class="mt-0.5 h-5 w-5 shrink-0" :class="config[toast.type].iconColor" />
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold" :class="config[toast.type].titleColor">{{ toast.title }}</p>
            <p v-if="toast.message" class="mt-0.5 text-sm text-slate-500">{{ toast.message }}</p>
          </div>
          <button
            class="shrink-0 rounded-lg p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            @click="dismiss(toast.id)"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>
