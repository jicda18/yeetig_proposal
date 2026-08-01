<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus, CheckCircle, Send, RotateCcw, XCircle, AlertTriangle, Info } from '@lucide/vue'
import PageHeader from '../components/ui/PageHeader.vue'
import ModalComponent from '../components/ui/ModalComponent.vue'
import AlertBox from '../components/ui/AlertBox.vue'
import { useToast } from '../composables/useToast'

const modalOpen = ref(false)

const alerts = ref([
  { id: 1, type: 'success' as const, title: 'Referral Created', visible: true },
  { id: 2, type: 'info' as const, title: 'Pro Tip', visible: true },
  { id: 3, type: 'warning' as const, title: 'Attention Required', visible: true },
])

const form = reactive({
  company: '',
  contactName: '',
  email: '',
  phone: '',
  commissionRate: 10,
  notes: '',
})

const errors = reactive<Record<string, string>>({})
const submitted = ref(false)

const toast = useToast()

function validate(): boolean {
  Object.keys(errors).forEach((k) => delete errors[k])
  if (!form.company.trim()) errors.company = 'Company name is required.'
  if (!form.contactName.trim()) errors.contactName = 'Contact name is required.'
  if (!form.email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
  }
  if (form.commissionRate < 1 || form.commissionRate > 50) {
    errors.commissionRate = 'Commission rate must be between 1% and 50%.'
  }
  return Object.keys(errors).length === 0
}

function handleSubmit() {
  if (!validate()) return
  submitted.value = true
  setTimeout(() => {
    modalOpen.value = false
    submitted.value = false
    toast.success('Form Submitted', `${form.company} has been saved successfully.`)
    resetForm()
  }, 1200)
}

function resetForm() {
  form.company = ''
  form.contactName = ''
  form.email = ''
  form.phone = ''
  form.commissionRate = 10
  form.notes = ''
  Object.keys(errors).forEach((k) => delete errors[k])
}

function dismissAlert(id: number) {
  const alert = alerts.value.find((a) => a.id === id)
  if (alert) alert.visible = false
}

function restoreAlerts() {
  alerts.value.forEach((a) => (a.visible = true))
}
</script>

<template>
  <div>
    <PageHeader title="UI Components & Forms" subtitle="Interactive forms, modals, alerts, and notifications">
      <template #actions>
        <button
          class="flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-200"
          @click="restoreAlerts"
        >
          <RotateCcw class="h-4 w-4" />
          Restore Alerts
        </button>
        <button
          class="group flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98]"
          @click="modalOpen = true"
        >
          <Plus class="h-4 w-4 transition-transform group-hover:rotate-90" />
          Open Modal Form
        </button>
      </template>
    </PageHeader>

    <!-- Alerts section -->
    <div class="mb-8">
      <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Alert System</h2>
      <div class="space-y-3">
        <AlertBox
          v-if="alerts[0].visible"
          type="success"
          title="Referral Created Successfully"
          :dismissible="true"
          @dismiss="dismissAlert(1)"
        >
          The company <span class="font-medium">TechNova Solutions</span> has been added to your referral network.
        </AlertBox>

        <AlertBox
          v-if="alerts[1].visible"
          type="info"
          title="Pro Tip"
          :dismissible="true"
          @dismiss="dismissAlert(2)"
        >
          Commissions are automatically computed upon cash receipt, not upon invoice issuance.
        </AlertBox>

        <AlertBox
          v-if="alerts[2].visible"
          type="warning"
          title="Pending Review"
          :dismissible="true"
          @dismiss="dismissAlert(3)"
        >
          You have 3 active leads in progress that have not generated payout commissions yet.
        </AlertBox>
      </div>
    </div>

    <!-- Toast demo section -->
    <div class="mb-8">
      <h2 class="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Toast Notifications</h2>
      <div class="flex flex-wrap gap-3">
        <button
          class="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-100 active:scale-95"
          @click="toast.success('Operation Successful', 'Referral client record created.')"
        >
          <CheckCircle class="h-4 w-4" />
          Success Toast
        </button>
        <button
          class="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-medium text-rose-700 transition-all hover:bg-rose-100 active:scale-95"
          @click="toast.error('Submission Failed', 'Could not save the requested record.')"
        >
          <XCircle class="h-4 w-4" />
          Error Toast
        </button>
        <button
          class="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-700 transition-all hover:bg-amber-100 active:scale-95"
          @click="toast.warning('Action Warning', 'You have 3 pending reviews.')"
        >
          <AlertTriangle class="h-4 w-4" />
          Warning Toast
        </button>
        <button
          class="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm font-medium text-indigo-700 transition-all hover:bg-indigo-100 active:scale-95"
          @click="toast.info('System Notice', 'Bi-weekly payout calculation complete.')"
        >
          <Info class="h-4 w-4" />
          Info Toast
        </button>
      </div>
    </div>

    <!-- Inline form section -->
    <div class="rounded-2xl border border-slate-200/60 bg-white p-6 card-shadow">
      <h2 class="mb-1 text-base font-semibold text-slate-900">Sample Registration Form</h2>
      <p class="mb-6 text-sm text-slate-500">An inline form featuring real-time client-side validation.</p>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Company Name</label>
            <input
              v-model="form.company"
              type="text"
              placeholder="e.g. Acme Corp"
              class="w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2"
              :class="errors.company
                ? 'border-rose-300 bg-rose-50/50 focus:border-rose-400 focus:ring-rose-100'
                : 'border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:bg-white focus:ring-indigo-100'"
            />
            <p v-if="errors.company" class="mt-1 text-xs text-rose-600">{{ errors.company }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Contact Name</label>
            <input
              v-model="form.contactName"
              type="text"
              placeholder="e.g. John Doe"
              class="w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2"
              :class="errors.contactName
                ? 'border-rose-300 bg-rose-50/50 focus:border-rose-400 focus:ring-rose-100'
                : 'border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:bg-white focus:ring-indigo-100'"
            />
            <p v-if="errors.contactName" class="mt-1 text-xs text-rose-600">{{ errors.contactName }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Email Address</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="john@acme.com"
              class="w-full rounded-xl border px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2"
              :class="errors.email
                ? 'border-rose-300 bg-rose-50/50 focus:border-rose-400 focus:ring-rose-100'
                : 'border-slate-200 bg-slate-50/50 focus:border-indigo-300 focus:bg-white focus:ring-indigo-100'"
            />
            <p v-if="errors.email" class="mt-1 text-xs text-rose-600">{{ errors.email }}</p>
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Phone Number (optional)</label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm transition-all focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
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
          <p v-if="errors.commissionRate" class="mt-1 text-xs text-rose-600">{{ errors.commissionRate }}</p>
        </div>

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">Additional Notes (optional)</label>
          <textarea
            v-model="form.notes"
            rows="3"
            placeholder="Special requirements or referral background..."
            class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm transition-all focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div class="flex items-center gap-3">
          <button
            type="submit"
            class="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98]"
          >
            <Send class="h-4 w-4" />
            Save Referral
          </button>
          <button
            type="button"
            class="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
            @click="resetForm"
          >
            Reset
          </button>
        </div>
      </form>
    </div>

    <!-- Modal -->
    <ModalComponent
      v-model="modalOpen"
      title="Add New Referral"
      subtitle="Complete client details to submit a new referral"
      max-width="max-w-xl"
    >
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Phone</label>
            <input
              v-model="form.phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              class="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm transition-all focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
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

        <div>
          <label class="mb-1.5 block text-sm font-medium text-slate-700">Notes</label>
          <textarea
            v-model="form.notes"
            rows="2"
            placeholder="Additional notes..."
            class="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm transition-all focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
