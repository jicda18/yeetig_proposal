<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  LayoutGrid,
  List,
  ArrowUpDown,
  Download,
  Trash2,
  TrendingUp,
  Eye,
  Building2,
  DollarSign,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
} from '@lucide/vue'
import PageHeader from '../components/ui/PageHeader.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import ModalComponent from '../components/ui/ModalComponent.vue'
import AvatarInitials from '../components/ui/AvatarInitials.vue'
import { useToast } from '../composables/useToast'
import { campaigns } from '../data/mockData'
import type { CampaignRow } from '../data/mockData'

const toast = useToast()

// View mode: 'table' | 'grid'
const viewMode = ref<'table' | 'grid'>('grid')

// Search & Filtering
const searchQuery = ref('')
const selectedStatus = ref<string>('All')
const selectedCategory = ref<string>('All')
const sortBy = ref<'name' | 'revenue' | 'conversion' | 'date'>('revenue')
const sortOrder = ref<'asc' | 'desc'>('desc')

// Selection state
const selectedIds = ref<number[]>([])

// Detail Modal
const selectedCampaign = ref<CampaignRow | null>(null)
const detailModalOpen = ref(false)

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(6)

// Filtering logic
const categories = computed(() => {
  const cats = Array.from(new Set(campaigns.map((c) => c.category)))
  return ['All', ...cats]
})

const filteredCampaigns = computed(() => {
  return campaigns.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.partner.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesStatus = selectedStatus.value === 'All' || c.status === selectedStatus.value
    const matchesCategory = selectedCategory.value === 'All' || c.category === selectedCategory.value

    return matchesSearch && matchesStatus && matchesCategory
  }).sort((a, b) => {
    let modifier = sortOrder.value === 'asc' ? 1 : -1
    if (sortBy.value === 'name') return a.name.localeCompare(b.name) * modifier
    if (sortBy.value === 'revenue') return (a.revenue - b.revenue) * modifier
    if (sortBy.value === 'conversion') return (a.conversionRate - b.conversionRate) * modifier
    if (sortBy.value === 'date') return (new Date(a.startDate).getTime() - new Date(b.startDate).getTime()) * modifier
    return 0
  })
})

const totalPages = computed(() => Math.ceil(filteredCampaigns.value.length / itemsPerPage.value) || 1)

const paginatedCampaigns = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredCampaigns.value.slice(start, start + itemsPerPage.value)
})

function toggleSelectAll() {
  if (selectedIds.value.length === paginatedCampaigns.value.length) {
    selectedIds.value = []
  } else {
    selectedIds.value = paginatedCampaigns.value.map((c) => c.id)
  }
}

function toggleSelect(id: number) {
  const idx = selectedIds.value.indexOf(id)
  if (idx > -1) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
}

function handleExportCSV() {
  toast.success('Export Started', `Exported ${selectedIds.value.length || filteredCampaigns.value.length} rows to CSV format.`)
}

function handleBatchDelete() {
  toast.warning('Batch Action', `Selected ${selectedIds.value.length} item(s) processed.`)
  selectedIds.value = []
}

function openDetail(campaign: CampaignRow) {
  selectedCampaign.value = campaign
  detailModalOpen.value = true
}

function formatCurrency(val: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
  <div>
    <PageHeader title="Partner Campaign Grid" subtitle="Interactive data grid with dual layout modes, sorting, filters, and batch controls">
      <template #actions>
        <button
          class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 active:scale-95"
          @click="handleExportCSV"
        >
          <Download class="h-4 w-4 text-slate-500" />
          Export CSV
        </button>
      </template>
    </PageHeader>

    <!-- Toolbar & Filter Controls -->
    <div class="mb-6 rounded-2xl border border-slate-200/60 bg-white p-4 card-shadow space-y-4">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <!-- Search input -->
        <div class="relative flex-1 max-w-md">
          <Search class="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search campaign, partner or category..."
            class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <!-- Right actions: view toggle & sort -->
        <div class="flex items-center gap-3">
          <!-- Sort dropdown -->
          <div class="flex items-center gap-2">
            <ArrowUpDown class="h-4 w-4 text-slate-400" />
            <select
              v-model="sortBy"
              class="rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-sm text-slate-700 transition-all focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="revenue">Sort by Revenue</option>
              <option value="name">Sort by Name</option>
              <option value="conversion">Sort by Conversion</option>
              <option value="date">Sort by Date</option>
            </select>
            <button
              class="rounded-xl border border-slate-200 bg-slate-50/50 p-2 text-slate-600 hover:bg-slate-100"
              @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'"
              :title="`Order: ${sortOrder}`"
            >
              <span class="text-xs font-bold uppercase">{{ sortOrder }}</span>
            </button>
          </div>

          <!-- Layout switch -->
          <div class="flex rounded-xl border border-slate-200 p-1 bg-slate-100/70">
            <button
              class="rounded-lg p-1.5 transition-all"
              :class="viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'"
              @click="viewMode = 'grid'"
              title="Card Grid View"
            >
              <LayoutGrid class="h-4 w-4" />
            </button>
            <button
              class="rounded-lg p-1.5 transition-all"
              :class="viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'"
              @click="viewMode = 'table'"
              title="Table View"
            >
              <List class="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- Secondary filter pills row -->
      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <!-- Status filter tabs -->
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-xs font-medium text-slate-400 mr-1 flex items-center gap-1">
            <Filter class="h-3 w-3" /> Status:
          </span>
          <button
            v-for="st in ['All', 'Active', 'In Progress', 'Pending', 'Archived']"
            :key="st"
            class="rounded-lg px-3 py-1 text-xs font-medium transition-all"
            :class="selectedStatus === st ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            @click="selectedStatus = st"
          >
            {{ st }}
          </button>
        </div>

        <!-- Category Filter -->
        <div class="flex items-center gap-2 text-xs">
          <span class="text-slate-400">Category:</span>
          <select
            v-model="selectedCategory"
            class="rounded-lg border border-slate-200 bg-white py-1 px-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Bulk Action Banner if items selected -->
    <transition
      enter-active-class="transition-all duration-200"
      leave-active-class="transition-all duration-150"
      enter-from-class="opacity-0 -translate-y-2"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="selectedIds.length > 0"
        class="mb-6 flex items-center justify-between rounded-xl bg-slate-900 px-5 py-3 text-white shadow-lg"
      >
        <p class="text-sm font-medium">
          <span class="font-bold text-indigo-400">{{ selectedIds.length }}</span> item(s) selected
        </p>
        <div class="flex items-center gap-3">
          <button
            class="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium hover:bg-slate-700"
            @click="handleExportCSV"
          >
            <Download class="h-3.5 w-3.5" />
            Export Selected
          </button>
          <button
            class="flex items-center gap-1.5 rounded-lg bg-rose-600/30 text-rose-300 px-3 py-1.5 text-xs font-medium hover:bg-rose-600/50"
            @click="handleBatchDelete"
          >
            <Trash2 class="h-3.5 w-3.5" />
            Remove Selected
          </button>
        </div>
      </div>
    </transition>

    <!-- GRID MODE VIEW -->
    <div v-if="viewMode === 'grid'" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="campaign in paginatedCampaigns"
        :key="campaign.id"
        class="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 card-shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <!-- Card Top Bar -->
        <div>
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <input
                type="checkbox"
                :checked="selectedIds.includes(campaign.id)"
                class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                @change="toggleSelect(campaign.id)"
              />
              <AvatarInitials :name="campaign.partner" size="md" />
            </div>
            <StatusBadge :status="campaign.status" />
          </div>

          <!-- Main Info -->
          <div class="mt-4">
            <span class="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
              {{ campaign.category }}
            </span>
            <h3 class="mt-1.5 text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
              {{ campaign.name }}
            </h3>
            <p class="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <Building2 class="h-3.5 w-3.5 text-slate-400" />
              {{ campaign.partner }}
            </p>
          </div>

          <!-- Stats Grid inside card -->
          <div class="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
            <div>
              <p class="text-[11px] font-medium text-slate-400 uppercase">Revenue</p>
              <p class="text-sm font-bold text-slate-900">{{ formatCurrency(campaign.revenue) }}</p>
            </div>
            <div>
              <p class="text-[11px] font-medium text-slate-400 uppercase">Leads</p>
              <p class="text-sm font-bold text-slate-900">{{ campaign.leads }}</p>
            </div>
            <div>
              <p class="text-[11px] font-medium text-slate-400 uppercase">Conv. Rate</p>
              <p class="text-sm font-bold text-emerald-600">{{ campaign.conversionRate }}%</p>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span>Started {{ formatDate(campaign.startDate) }}</span>
          <button
            class="flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            @click="openDetail(campaign)"
          >
            <Eye class="h-3.5 w-3.5" />
            Details
          </button>
        </div>
      </div>
    </div>

    <!-- TABLE MODE VIEW -->
    <div v-else class="overflow-hidden rounded-2xl border border-slate-200/60 bg-white card-shadow">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[800px]">
          <thead>
            <tr class="border-b border-slate-100 bg-slate-50/50">
              <th class="px-4 py-3.5 text-left w-10">
                <input
                  type="checkbox"
                  :checked="selectedIds.length === paginatedCampaigns.length && paginatedCampaigns.length > 0"
                  class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  @change="toggleSelectAll"
                />
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Campaign / Partner
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Category
              </th>
              <th class="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th class="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Leads
              </th>
              <th class="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Conv. Rate
              </th>
              <th class="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Total Revenue
              </th>
              <th class="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="campaign in paginatedCampaigns"
              :key="campaign.id"
              class="group transition-colors hover:bg-slate-50"
            >
              <td class="px-4 py-4">
                <input
                  type="checkbox"
                  :checked="selectedIds.includes(campaign.id)"
                  class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  @change="toggleSelect(campaign.id)"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <AvatarInitials :name="campaign.partner" size="sm" />
                  <div>
                    <p class="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {{ campaign.name }}
                    </p>
                    <p class="text-xs text-slate-500">{{ campaign.partner }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-xs font-medium text-slate-600">
                <span class="rounded-md bg-slate-100 px-2 py-1 text-slate-700">
                  {{ campaign.category }}
                </span>
              </td>
              <td class="px-6 py-4">
                <StatusBadge :status="campaign.status" />
              </td>
              <td class="px-6 py-4 text-right text-sm text-slate-700 font-medium">
                {{ campaign.leads }}
              </td>
              <td class="px-6 py-4 text-right text-sm font-semibold text-emerald-600">
                {{ campaign.conversionRate }}%
              </td>
              <td class="px-6 py-4 text-right text-sm font-bold text-slate-900">
                {{ formatCurrency(campaign.revenue) }}
              </td>
              <td class="px-6 py-4 text-right">
                <button
                  class="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                  @click="openDetail(campaign)"
                  title="View Details"
                >
                  <Eye class="h-4 w-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="filteredCampaigns.length === 0" class="mt-6 rounded-2xl border border-slate-200 bg-white p-12 text-center">
      <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
        <Search class="h-6 w-6" />
      </div>
      <h3 class="mt-4 text-base font-semibold text-slate-900">No campaigns found</h3>
      <p class="mt-1 text-sm text-slate-500">Try refining your search terms or clearing status filters.</p>
    </div>

    <!-- Pagination Controls -->
    <div v-if="filteredCampaigns.length > 0" class="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p class="text-sm text-slate-500">
        Showing
        <span class="font-medium text-slate-900">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
        to
        <span class="font-medium text-slate-900">{{ Math.min(currentPage * itemsPerPage, filteredCampaigns.length) }}</span>
        of
        <span class="font-medium text-slate-900">{{ filteredCampaigns.length }}</span> campaigns
      </p>

      <div class="flex items-center gap-2">
        <button
          class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          <ChevronLeft class="h-4 w-4" />
        </button>

        <span class="px-3 text-sm font-medium text-slate-700">
          Page {{ currentPage }} of {{ totalPages }}
        </span>

        <button
          class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <ChevronRight class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- Detail Modal Preview -->
    <ModalComponent
      v-model="detailModalOpen"
      :title="selectedCampaign?.name || 'Campaign Overview'"
      subtitle="Detailed performance metrics and partner info"
    >
      <div v-if="selectedCampaign" class="space-y-4">
        <div class="flex items-center justify-between rounded-xl bg-slate-50 p-4 border border-slate-100">
          <div class="flex items-center gap-3">
            <AvatarInitials :name="selectedCampaign.partner" size="md" />
            <div>
              <p class="text-sm font-bold text-slate-900">{{ selectedCampaign.partner }}</p>
              <p class="text-xs text-slate-500">Category: {{ selectedCampaign.category }}</p>
            </div>
          </div>
          <StatusBadge :status="selectedCampaign.status" />
        </div>

        <div class="grid grid-cols-3 gap-3">
          <div class="rounded-xl border border-slate-100 bg-white p-3 text-center">
            <DollarSign class="mx-auto h-4 w-4 text-indigo-600 mb-1" />
            <p class="text-xs text-slate-400">Total Revenue</p>
            <p class="text-base font-bold text-slate-900">{{ formatCurrency(selectedCampaign.revenue) }}</p>
          </div>
          <div class="rounded-xl border border-slate-100 bg-white p-3 text-center">
            <Users class="mx-auto h-4 w-4 text-purple-600 mb-1" />
            <p class="text-xs text-slate-400">Captured Leads</p>
            <p class="text-base font-bold text-slate-900">{{ selectedCampaign.leads }}</p>
          </div>
          <div class="rounded-xl border border-slate-100 bg-white p-3 text-center">
            <TrendingUp class="mx-auto h-4 w-4 text-emerald-600 mb-1" />
            <p class="text-xs text-slate-400">Conversion</p>
            <p class="text-base font-bold text-emerald-600">{{ selectedCampaign.conversionRate }}%</p>
          </div>
        </div>

        <div class="rounded-xl bg-slate-50 p-3 text-xs text-slate-600 space-y-1">
          <p><span class="font-medium text-slate-700">Start Date:</span> {{ formatDate(selectedCampaign.startDate) }}</p>
          <p><span class="font-medium text-slate-700">Campaign ID:</span> #CMP-00{{ selectedCampaign.id }}</p>
          <p><span class="font-medium text-slate-700">Billing Model:</span> Cash Received Basis (ACH Payout)</p>
        </div>
      </div>

      <template #footer>
        <button
          class="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          @click="detailModalOpen = false"
        >
          Close
        </button>
      </template>
    </ModalComponent>
  </div>
</template>
