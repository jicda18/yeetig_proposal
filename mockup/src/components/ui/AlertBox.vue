<script setup lang="ts">
import { computed } from 'vue'
import { CheckCircle, AlertTriangle, Info, XCircle, X } from '@lucide/vue'

const props = withDefaults(defineProps<{
  type?: 'success' | 'warning' | 'error' | 'info'
  title?: string
  dismissible?: boolean
}>(), {
  type: 'info',
  dismissible: true,
})

const emit = defineEmits<{
  dismiss: []
}>()

const config = computed(() => {
  switch (props.type) {
    case 'success':
      return { icon: CheckCircle, bg: 'bg-emerald-50', border: 'border-emerald-200', iconColor: 'text-emerald-600', titleColor: 'text-emerald-900' }
    case 'warning':
      return { icon: AlertTriangle, bg: 'bg-amber-50', border: 'border-amber-200', iconColor: 'text-amber-600', titleColor: 'text-amber-900' }
    case 'error':
      return { icon: XCircle, bg: 'bg-rose-50', border: 'border-rose-200', iconColor: 'text-rose-600', titleColor: 'text-rose-900' }
    default:
      return { icon: Info, bg: 'bg-indigo-50', border: 'border-indigo-200', iconColor: 'text-indigo-600', titleColor: 'text-indigo-900' }
  }
})
</script>

<template>
  <transition
    enter-active-class="transition-all duration-300"
    leave-active-class="transition-all duration-200"
    enter-from-class="opacity-0 translate-y-2"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      class="flex items-start gap-3 rounded-xl border px-4 py-3"
      :class="[config.bg, config.border]"
    >
      <component :is="config.icon" class="mt-0.5 h-5 w-5 shrink-0" :class="config.iconColor" />
      <div class="min-w-0 flex-1">
        <p v-if="title" class="text-sm font-semibold" :class="config.titleColor">{{ title }}</p>
        <div class="text-sm text-slate-600">
          <slot />
        </div>
      </div>
      <button
        v-if="dismissible"
        class="shrink-0 rounded-lg p-0.5 text-slate-400 transition-colors hover:bg-white/50 hover:text-slate-600"
        @click="emit('dismiss')"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </transition>
</template>
