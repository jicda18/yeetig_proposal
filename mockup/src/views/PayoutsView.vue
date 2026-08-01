<script setup lang="ts">
import { ArrowDownLeft, ArrowUpRight, Info, CheckCircle } from '@lucide/vue'
import PageHeader from '../components/ui/PageHeader.vue'
import AvatarInitials from '../components/ui/AvatarInitials.vue'
import StatusBadge from '../components/ui/StatusBadge.vue'
import { clientPayments, payouts } from '../data/mockData'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(value)
}

const totalCommissionsEarned = clientPayments.reduce((sum, p) => sum + p.commissionEarned, 0)
const totalPayouts = payouts.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0)
</script>

<template>
  <div>
    <PageHeader title="Payouts & Billing" subtitle="Commissions are based strictly on cash collected, not invoiced" />

    <!-- Business rule notice -->
    <div
      class="mb-6 flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 px-4 py-3"
    >
      <Info class="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
      <p class="text-sm text-indigo-900">
        <span class="font-semibold">Key Rule:</span> Your commissions are calculated based on actual cash collected by Yeetiq from your referred clients, not on invoice issuance. You generate commission when the client pays.
      </p>
    </div>

    <!-- Two-column grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Left: Client Payments (Commissionable Base) -->
      <div class="rounded-2xl border border-slate-200/60 bg-white card-shadow">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <ArrowDownLeft class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-slate-900">Client Payments</h2>
              <p class="text-xs text-slate-500">Commissionable basis</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs text-slate-400">Total Commissioned</p>
            <p class="text-lg font-bold text-emerald-600">{{ formatCurrency(totalCommissionsEarned) }}</p>
          </div>
        </div>

        <ul class="divide-y divide-slate-100">
          <li
            v-for="payment in clientPayments"
            :key="payment.id"
            class="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
          >
            <AvatarInitials :name="payment.company" size="sm" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium text-slate-900">{{ payment.company }}</p>
              <p class="text-xs text-slate-500">{{ formatDate(payment.date) }}</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-xs text-slate-400">Client Paid</p>
                <p class="text-sm font-medium text-slate-700">{{ formatCurrency(payment.amountReceived) }}</p>
              </div>
              <div class="h-8 w-px bg-slate-200" />
              <div class="text-right">
                <p class="text-xs text-slate-400">Your Commission ({{ payment.commissionRate }}%)</p>
                <p class="text-sm font-semibold text-emerald-600">+{{ formatCurrency(payment.commissionEarned) }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <!-- Right: Payouts -->
      <div class="rounded-2xl border border-slate-200/60 bg-white card-shadow">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ArrowUpRight class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-base font-semibold text-slate-900">Payout Settlement</h2>
              <p class="text-xs text-slate-500">Transfers to your bank account</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs text-slate-400">Total Paid Out</p>
            <p class="text-lg font-bold text-indigo-600">{{ formatCurrency(totalPayouts) }}</p>
          </div>
        </div>

        <ul class="divide-y divide-slate-100">
          <li
            v-for="payout in payouts"
            :key="payout.id"
            class="group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50"
          >
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
              <ArrowUpRight class="h-5 w-5" />
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium text-slate-900">{{ payout.method }}</p>
              <p class="truncate text-xs text-slate-500">{{ payout.reference }} · {{ formatDate(payout.date) }}</p>
            </div>
            <div class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-sm font-semibold text-slate-900">{{ formatCurrency(payout.amount) }}</p>
                <p class="text-xs text-slate-400">{{ payout.method }}</p>
              </div>
              <StatusBadge :status="payout.status" />
            </div>
          </li>
        </ul>

        <!-- Footer note -->
        <div class="flex items-center gap-2 border-t border-slate-100 px-6 py-3">
          <CheckCircle class="h-4 w-4 text-emerald-500" />
          <p class="text-xs text-slate-500">All settlements are processed via ACH every 15 days.</p>
        </div>
      </div>
    </div>
  </div>
</template>
