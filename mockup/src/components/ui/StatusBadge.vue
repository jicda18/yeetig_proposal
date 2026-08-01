<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  status: string
}>()

const badgeClasses = computed(() => {
  switch (props.status) {
    case 'Active':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
    case 'In Progress':
      return 'bg-amber-50 text-amber-700 ring-amber-600/20'
    case 'Inactive':
      return 'bg-slate-100 text-slate-600 ring-slate-500/20'
    case 'Pending':
      return 'bg-amber-50 text-amber-700 ring-amber-600/20'
    case 'Archived':
      return 'bg-slate-100 text-slate-600 ring-slate-500/20'
    case 'PAID':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 ring-amber-600/20'
    case 'PROCESSING':
      return 'bg-sky-50 text-sky-700 ring-sky-600/20'
    default:
      return 'bg-slate-100 text-slate-600 ring-slate-500/20'
  }
})

const dotClasses = computed(() => {
  switch (props.status) {
    case 'Active':
    case 'PAID':
      return 'bg-emerald-500'
    case 'In Progress':
    case 'Pending':
    case 'PENDING':
      return 'bg-amber-500'
    case 'PROCESSING':
      return 'bg-sky-500'
    default:
      return 'bg-slate-400'
  }
})
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset"
    :class="badgeClasses"
  >
    <span class="h-1.5 w-1.5 rounded-full" :class="dotClasses" />
    {{ status }}
  </span>
</template>
