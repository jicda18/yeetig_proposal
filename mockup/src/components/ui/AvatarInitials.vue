<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  name: string
  size?: 'sm' | 'md' | 'lg'
}>()

const initials = computed(() => {
  const words = props.name.split(' ')
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase()
  }
  return props.name.slice(0, 2).toUpperCase()
})

const colorClasses = computed(() => {
  const colors = [
    'bg-indigo-100 text-indigo-700',
    'bg-emerald-100 text-emerald-700',
    'bg-purple-100 text-purple-700',
    'bg-fuchsia-100 text-fuchsia-700',
    'bg-sky-100 text-sky-700',
    'bg-rose-100 text-rose-700',
  ]
  let hash = 0
  for (let i = 0; i < props.name.length; i++) {
    hash = props.name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 w-8 text-xs'
    case 'lg':
      return 'h-12 w-12 text-base'
    default:
      return 'h-10 w-10 text-sm'
  }
})
</script>

<template>
  <div
    class="flex shrink-0 items-center justify-center rounded-full font-semibold ring-2 ring-white"
    :class="[colorClasses, sizeClasses]"
  >
    {{ initials }}
  </div>
</template>
