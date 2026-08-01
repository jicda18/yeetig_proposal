<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { Plus, CheckCircle } from '@lucide/vue'
import PageHeader from '../components/ui/PageHeader.vue'
import AvatarInitials from '../components/ui/AvatarInitials.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import ModalComponent from '../components/ui/ModalComponent.vue'
import { useToast } from '../composables/useToast'
import { referrals, referralCounts } from '../data/mockData'
import type { ReferralStatus } from '../data/mockData'

type FilterKey = 'all' | ReferralStatus

const activeFilter = ref<FilterKey>('all')

const modalOpen = ref(false)
const submitted = ref(false)
const form = reactive({
  company: '',
  contactName: '',
  email: '',
  commissionRate: 10,
})
const errors = reactive<Record<string, string>>({})

const toast = useToast()

function handleSubmit() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.company.trim()) errors.company = 'Company name is required.'
  if (!form.contactName.trim()) errors.contactName = 'Contact name is required.'
  if (!form.email.trim()) errors.email = 'Email address is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email address.'
  if (Object.keys(errors).length > 0) return
  submitted.value = true
  setTimeout(() => {
    modalOpen.value = false
    submitted.value = false
    toast.success('Referral added', `${form.company} has been added successfully.`)
    form.company = ''
    form.contactName = ''
    form.email = ''
    form.commissionRate = 10
  }, 1000)
}

const filters = computed(() => [
  { key: 'all' as FilterKey, label: 'All', count: referralCounts.total },
  { key: 'Active' as FilterKey, label: 'Active', count: referralCounts.active },
  { key: 'In Progress' as FilterKey, label: 'In Progress', count: referralCounts.inProgress },
  { key: 'Inactive' as FilterKey, label: 'Inactive', count: referralCounts.inactive },
])

const filteredReferrals = computed(() => {
  if (activeFilter.value === 'all') return referrals
  return referrals.filter((r) => r.status === activeFilter.value)
})

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value)
}
</script>

<template>
  <div>
    <PageHeader title="My Referrals" subtitle="Manage and track your referred client network">
      <template #actions>
        <button
          class="group flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98]"
          @click="modalOpen = true"
        >
          <Plus class="h-4 w-4 transition-transform group-hover:rotate-90" />
          Add Referral
        </button>
      </template>
    </PageHeader>

    <!-- Filter pills -->
    <div class="mb-6 flex flex-wrap gap-2">
      <button
        v-for="f in filters"
        :key="f.key"
        class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all"
        :class="[
          activeFilter === f.key
            ? 'bg-slate-900 text-white shadow-sm'
            : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50 hover:text-slate-900',
        ]"
        @click="activeFilter = f.key"
      >
        {{ f.label }}
        <span
          class="rounded-full px-1.5 py-0.5 text-xs font-semibold"
          :class="[
            activeFilter === f.key
              ? 'bg-white/20 text-white'
              : 'bg-slate-100 text-slate-500',
          ]"
        >
          {{ f.count }}
        </span>
      </button>
    </div>

    <!-- Data Table -->
    <div class="overflow-hidden rounded-2xl border border-slate-200/60 bg-white card-shadow">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/50">
              <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Client / Company
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Registration Date
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Commission Rate
              </th>
              <th class="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Earned Commissions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="referral in filteredReferrals"
              :key="referral.id"
              class="group transition-colors hover:bg-slate-50"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <AvatarInitials :name="referral.company" size="sm" />
                  <div>
                    <p class="text-sm font-medium text-slate-900">{{ referral.company }}</p>
                    <p class="text-xs text-slate-500">{{ referral.contactName }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-600">
                {{ formatDate(referral.registeredDate) }}
              </td>
              <td class="px-6 py-4">
                <StatusBadge :status="referral.status" />
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center rounded-lg bg-indigo-50 px-2.5 py-1 text-sm font-medium text-indigo-700">
                  {{ referral.commissionRate }}%
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <span
                  class="text-sm font-semibold"
                  :class="referral.commissionEarned > 0 ? 'text-emerald-600' : 'text-slate-400'"
                >
                  {{ formatCurrency(referral.commissionEarned) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty state -->
      <div v-if="filteredReferrals.length === 0" class="px-6 py-12 text-center">
        <p class="text-sm text-slate-500">No referrals found in this category.</p>
      </div>
    </div>

    <!-- Add Referral Modal -->
    <ModalComponent
      v-model="modalOpen"
      title="Add New Referral"
      subtitle="Complete client details to submit a new referral"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">Company</label>
          <input
            v-model="form.company"
            type="text"
            placeholder="Company name"
            class="w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2"
            :class="errors.company
              ? 'border-rose-300 bg-rose-50/50 focus:border-rose-400 focus:ring-rose-100'
              : 'border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:bg-white focus:ring-indigo-100'"
          />
          <p v-if="errors.company" class="mt-1 text-xs text-rose-600">{{ errors.company }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">Contact</label>
          <input
            v-model="form.contactName"
            type="text"
            placeholder="Contact name"
            class="w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2"
            :class="errors.contactName
              ? 'border-rose-300 bg-rose-50/50 focus:border-rose-400 focus:ring-rose-100'
              : 'border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:bg-white focus:ring-indigo-100'"
          />
          <p v-if="errors.contactName" class="mt-1 text-xs text-rose-600">{{ errors.contactName }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="email@company.com"
            class="w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2"
            :class="errors.email
              ? 'border-rose-300 bg-rose-50/50 focus:border-rose-400 focus:ring-rose-100'
              : 'border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:bg-white focus:ring-indigo-100'"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-rose-600">{{ errors.email }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">
            Commission Rate: <span class="font-bold text-indigo-600">{{ form.commissionRate }}%</span>
          </label>
          <input
            v-model.number="form.commissionRate"
            type="range"
            min="1"
            max="50"
            class="w-full accent-indigo-600"
          />
        </div>
      </form>

      <template #footer>
        <button
          class="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          @click="modalOpen = false"
        >
          Cancel
        </button>
        <button
          class="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]"
          @click="handleSubmit"
        >
          <span v-if="submitted" class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <CheckCircle v-else class="h-4 w-4" />
          {{ submitted ? 'Saving...' : 'Save' }}
        </button>
      </template>
    </ModalComponent>
  </div>
</template>
