<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Clock, CheckCircle, Users, Plus, TrendingUp } from '@lucide/vue'
import PageHeader from '../components/ui/PageHeader.vue'
import StatCard from '../components/ui/StatCard.vue'
import AvatarInitials from '../components/ui/AvatarInitials.vue'
import ModalComponent from '../components/ui/ModalComponent.vue'
import { useToast } from '../composables/useToast'
import { recentPayments } from '../data/mockData'

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value)

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

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
</script>

<template>
  <div>
    <PageHeader title="Financial Overview" subtitle="Your referral and commission activity at a glance" />

    <!-- Stat Cards -->
    <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        label="Pending Commissions"
        :value="formatCurrency(1450.0)"
        :icon="Clock"
        accent="indigo"
        sub-text="+12% this week"
      >
        <template #badges>
          <span class="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <TrendingUp class="h-3 w-3" />
            +12%
          </span>
          <span class="text-xs text-slate-400">vs. previous week</span>
        </template>
      </StatCard>

      <StatCard
        label="Total Paid"
        :value="formatCurrency(12800.0)"
        :icon="CheckCircle"
        accent="emerald"
        sub-text="Last payout: Aug 15"
      />

      <StatCard
        label="Referred Clients"
        value="24"
        :icon="Users"
        accent="purple"
      >
        <template #badges>
          <span class="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            8 Active
          </span>
          <span class="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
            3 In Progress
          </span>
        </template>
      </StatCard>
    </div>

    <!-- Below cards grid -->
    <div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Left: Recent Payments (span 2) -->
      <div class="lg:col-span-2">
        <div class="rounded-2xl border border-slate-200/60 bg-white card-shadow">
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div>
              <h2 class="text-base font-semibold text-slate-900">Recent Payments Received</h2>
              <p class="text-sm text-slate-500">Commissions earned on cash collected</p>
            </div>
            <router-link to="/payouts" class="text-sm font-medium text-indigo-600 hover:text-indigo-700">
              View all
            </router-link>
          </div>

          <ul class="divide-y divide-slate-100">
            <li
              v-for="payment in recentPayments"
              :key="payment.id"
              class="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
            >
              <AvatarInitials :name="payment.company" />
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-medium text-slate-900">{{ payment.company }}</p>
                <p class="truncate text-xs text-slate-500">{{ payment.contactName }} · {{ formatDate(payment.date) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm font-semibold text-emerald-600">+{{ formatCurrency(payment.commissionEarned) }}</p>
                <p class="text-xs text-slate-400">from {{ formatCurrency(payment.amountReceived) }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Right: Referral CTA (span 1) -->
      <div class="lg:col-span-1">
        <div
          class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 p-6 text-white card-shadow-lg"
        >
          <!-- Glowing background effects -->
          <div class="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/30 blur-3xl" />
          <div class="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />
          <div class="pointer-events-none absolute right-4 top-4 h-24 w-24 rounded-full bg-fuchsia-500/10 blur-2xl" />

          <div class="relative">
            <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
              <TrendingUp class="h-6 w-6 text-indigo-300" />
            </div>

            <h2 class="mt-5 text-xl font-bold">Refer & Earn</h2>
            <p class="mt-2 text-sm leading-relaxed text-slate-300">
              For every client you refer to Yeetiq, earn a commission on payments received. No limits!
            </p>

            <div class="mt-5 space-y-2.5">
              <div class="flex items-center gap-2 text-sm text-slate-300">
                <span class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle class="h-3 w-3" />
                </span>
                10% commission per referral
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-300">
                <span class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle class="h-3 w-3" />
                </span>
                Bi-weekly ACH payouts
              </div>
              <div class="flex items-center gap-2 text-sm text-slate-300">
                <span class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <CheckCircle class="h-3 w-3" />
                </span>
                Real-time tracking dashboard
              </div>
            </div>

            <button
              class="group mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition-all hover:bg-slate-100 hover:shadow-lg active:scale-[0.98]"
              @click="modalOpen = true"
            >
              <Plus class="h-4 w-4 transition-transform group-hover:rotate-90" />
              Add Referral
            </button>

            <p class="mt-3 text-center text-xs text-slate-400">
              <span class="font-semibold text-indigo-300">24</span> active referrals this month
            </p>
          </div>
        </div>
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
