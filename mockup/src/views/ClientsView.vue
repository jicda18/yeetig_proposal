<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import {
  Users,
  Building2,
  Mail,
  Phone,
  Plus,
  Search,
  CheckCircle,
  MoreVertical,
  Edit3,
  Trash2,
  DollarSign,
  TrendingUp,
  UserCheck,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from '@lucide/vue'
import PageHeader from '../components/ui/PageHeader.vue'
import StatCard from '../components/ui/StatCard.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import AvatarInitials from '../components/ui/AvatarInitials.vue'
import ModalComponent from '../components/ui/ModalComponent.vue'
import { useToast } from '../composables/useToast'
import { clientsList } from '../data/mockData'
import type { ClientRow, ClientStatus, ClientTier } from '../data/mockData'

const toast = useToast()

const activeStatusFilter = ref<string>('All')
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(5)

// Modal state
const modalOpen = ref(false)
const submitted = ref(false)
const form = reactive({
  name: '',
  company: '',
  email: '',
  phone: '',
  tier: 'Enterprise' as ClientTier,
})
const errors = reactive<Record<string, string>>({})

// Filter logic
const filteredClients = computed(() => {
  return clientsList.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus =
      activeStatusFilter.value === 'All' || client.status === activeStatusFilter.value

    return matchesSearch && matchesStatus
  })
})

const totalPages = computed(() => Math.ceil(filteredClients.value.length / itemsPerPage.value) || 1)

const paginatedClients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredClients.value.slice(start, start + itemsPerPage.value)
})

// Stats
const totalClients = computed(() => clientsList.length)
const activeCount = computed(() => clientsList.filter((c) => c.status === 'Active').length)
const enterpriseCount = computed(() => clientsList.filter((c) => c.tier === 'Enterprise').length)
const totalSpentSum = computed(() => clientsList.reduce((sum, c) => sum + c.totalSpent, 0))

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function handleSubmit() {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.name.trim()) errors.name = 'Client name is required.'
  if (!form.company.trim()) errors.company = 'Company name is required.'
  if (!form.email.trim()) errors.email = 'Email address is required.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email format.'

  if (Object.keys(errors).length > 0) return

  submitted.value = true
  setTimeout(() => {
    modalOpen.value = false
    submitted.value = false
    toast.success('Client Added', `${form.name} (${form.company}) has been added successfully.`)
    form.name = ''
    form.company = ''
    form.email = ''
    form.phone = ''
    form.tier = 'Enterprise'
  }, 1000)
}

function handleDeleteClient(name: string) {
  toast.warning('Client Archived', `${name} account status updated.`)
}
</script>

<template>
  <div>
    <PageHeader title="Client Directory Table" subtitle="Comprehensive tabular management of referred enterprise & SMB accounts">
      <template #actions>
        <button
          class="group flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98]"
          @click="modalOpen = true"
        >
          <Plus class="h-4 w-4 transition-transform group-hover:rotate-90" />
          Add New Client
        </button>
      </template>
    </PageHeader>

    <!-- Stat Cards Header -->
    <div class="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Accounts"
        :value="totalClients.toString()"
        :icon="Users"
        accent="indigo"
      />
      <StatCard
        label="Active Subscriptions"
        :value="activeCount.toString()"
        :icon="UserCheck"
        accent="emerald"
      />
      <StatCard
        label="Enterprise Tier"
        :value="enterpriseCount.toString()"
        :icon="ShieldCheck"
        accent="purple"
      />
      <StatCard
        label="Cumulative Billing"
        :value="formatCurrency(totalSpentSum)"
        :icon="DollarSign"
        accent="indigo"
      />
    </div>

    <!-- Table Container Card -->
    <div class="rounded-2xl border border-slate-200/60 bg-white card-shadow overflow-hidden">
      <!-- Table Header & Controls Bar -->
      <div class="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
        <!-- Search bar -->
        <div class="relative flex-1 max-w-md">
          <Search class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by client, company, or email..."
            class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <!-- Filter tabs -->
        <div class="flex items-center gap-1.5">
          <button
            v-for="st in ['All', 'Active', 'Onboarding', 'Inactive']"
            :key="st"
            class="rounded-lg px-3 py-1.5 text-xs font-medium transition-all"
            :class="activeStatusFilter === st ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            @click="activeStatusFilter = st"
          >
            {{ st }}
          </button>
        </div>
      </div>

      <!-- Main Data Table -->
      <div class="overflow-x-auto">
        <table class="w-full min-w-[850px] text-left">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/50">
              <th class="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Client / Company
              </th>
              <th class="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Contact Info
              </th>
              <th class="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Plan Tier
              </th>
              <th class="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th class="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Spent
              </th>
              <th class="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Last Activity
              </th>
              <th class="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="client in paginatedClients"
              :key="client.id"
              class="group transition-colors hover:bg-slate-50/80"
            >
              <!-- Name & Company -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <AvatarInitials :name="client.company" size="md" />
                  <div>
                    <p class="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {{ client.name }}
                    </p>
                    <p class="text-xs text-slate-500 flex items-center gap-1">
                      <Building2 class="h-3 w-3 text-slate-400" />
                      {{ client.company }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Email & Phone -->
              <td class="px-6 py-4">
                <p class="text-xs font-medium text-slate-700 flex items-center gap-1.5">
                  <Mail class="h-3.5 w-3.5 text-slate-400" />
                  {{ client.email }}
                </p>
                <p class="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <Phone class="h-3.5 w-3.5 text-slate-400" />
                  {{ client.phone }}
                </p>
              </td>

              <!-- Plan Tier -->
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold"
                  :class="{
                    'bg-purple-50 text-purple-700 ring-1 ring-purple-600/20': client.tier === 'Enterprise',
                    'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20': client.tier === 'Pro',
                    'bg-slate-100 text-slate-700 ring-1 ring-slate-400/20': client.tier === 'Starter',
                  }"
                >
                  {{ client.tier }}
                </span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
                <StatusBadge :status="client.status" />
              </td>

              <!-- Total Spent -->
              <td class="px-6 py-4 text-right">
                <span class="text-sm font-bold text-slate-900">
                  {{ formatCurrency(client.totalSpent) }}
                </span>
              </td>

              <!-- Last Activity -->
              <td class="px-6 py-4 text-right text-xs text-slate-500">
                {{ formatDate(client.lastActivity) }}
              </td>

              <!-- Actions -->
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <button
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                    title="Edit Client"
                  >
                    <Edit3 class="h-4 w-4" />
                  </button>
                  <button
                    class="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    title="Archive Client"
                    @click="handleDeleteClient(client.name)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredClients.length === 0" class="p-12 text-center">
        <p class="text-sm text-slate-500">No client accounts match your current filter.</p>
      </div>

      <!-- Pagination Footer -->
      <div v-if="filteredClients.length > 0" class="flex items-center justify-between border-t border-slate-100 px-6 py-4">
        <p class="text-xs text-slate-500">
          Showing <span class="font-medium text-slate-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span> to
          <span class="font-medium text-slate-900">{{ Math.min(currentPage * itemsPerPage, filteredClients.length) }}</span> of
          <span class="font-medium text-slate-900">{{ filteredClients.length }}</span> clients
        </p>

        <div class="flex items-center gap-2">
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            :disabled="currentPage === 1"
            @click="currentPage--"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>
          <span class="text-xs font-medium text-slate-700">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <ModalComponent
      v-model="modalOpen"
      title="Add New Client Account"
      subtitle="Register a new client company into the partner management system"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">Client Contact Name</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="e.g. Jane Doe"
            class="w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2"
            :class="errors.name ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-100'"
          />
          <p v-if="errors.name" class="mt-1 text-xs text-rose-600">{{ errors.name }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">Company Name</label>
          <input
            v-model="form.company"
            type="text"
            placeholder="e.g. Acme Global Corp"
            class="w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2"
            :class="errors.company ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-100'"
          />
          <p v-if="errors.company" class="mt-1 text-xs text-rose-600">{{ errors.company }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">Email Address</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="contact@company.com"
            class="w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2"
            :class="errors.email ? 'border-rose-300 bg-rose-50/50 focus:ring-rose-100' : 'border-slate-200 focus:border-indigo-300 focus:ring-indigo-100'"
          />
          <p v-if="errors.email" class="mt-1 text-xs text-rose-600">{{ errors.email }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">Phone Number</label>
          <input
            v-model="form.phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            class="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm transition-all focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">Plan Tier</label>
          <select
            v-model="form.tier"
            class="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
          >
            <option value="Enterprise">Enterprise</option>
            <option value="Pro">Pro</option>
            <option value="Starter">Starter</option>
          </select>
        </div>
      </form>

      <template #footer>
        <button
          class="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100"
          @click="modalOpen = false"
        >
          Cancel
        </button>
        <button
          class="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
          @click="handleSubmit"
        >
          <span v-if="submitted" class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <CheckCircle v-else class="h-4 w-4" />
          {{ submitted ? 'Saving...' : 'Save Client' }}
        </button>
      </template>
    </ModalComponent>
  </div>
</template>
