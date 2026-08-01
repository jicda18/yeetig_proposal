<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  label: string
  value: string
  subText?: string
  icon: Component
  accent?: 'indigo' | 'emerald' | 'purple'
}>()
</script>

<template>
  <div
    class="group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-white p-6 card-shadow transition-all duration-300 hover:-translate-y-0.5 hover:card-shadow-lg"
  >
    <!-- Decorative gradient shapes -->
    <div
      class="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
      :class="{
        'bg-indigo-400': accent === 'indigo' || !accent,
        'bg-emerald-400': accent === 'emerald',
        'bg-purple-400': accent === 'purple',
      }"
    />
    <div
      class="pointer-events-none absolute -bottom-10 -left-6 h-24 w-24 rounded-full opacity-10 blur-2xl"
      :class="{
        'bg-indigo-500': accent === 'indigo' || !accent,
        'bg-emerald-500': accent === 'emerald',
        'bg-purple-500': accent === 'purple',
      }"
    />

    <div class="relative">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm font-medium text-slate-500">{{ label }}</p>
          <p class="mt-2 text-3xl font-bold tracking-tight text-slate-900">{{ value }}</p>
        </div>
        <div
          class="flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
          :class="{
            'bg-indigo-50 text-indigo-600': accent === 'indigo' || !accent,
            'bg-emerald-50 text-emerald-600': accent === 'emerald',
            'bg-purple-50 text-purple-600': accent === 'purple',
          }"
        >
          <component :is="icon" class="h-5 w-5" />
        </div>
      </div>

      <div v-if="subText" class="mt-4">
        <p class="text-sm text-slate-500">{{ subText }}</p>
      </div>

      <div v-if="$slots.badges" class="mt-4 flex flex-wrap gap-2">
        <slot name="badges" />
      </div>
    </div>
  </div>
</template>
