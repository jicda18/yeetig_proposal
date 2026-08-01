<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Users,
  Wallet,
  Search,
  Bell,
  Settings,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  TableProperties,
  ChevronDown,
  Handshake,
  FlaskConical,
  LogOut,
} from '@lucide/vue'
import AvatarInitials from './ui/AvatarInitials.vue'
import ToastContainer from './ui/ToastContainer.vue'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)

// Track open submenus
const openMenus = ref<Record<string, boolean>>({
  partnerships: true,
  demos: false,
})

function toggleMenu(key: string) {
  openMenus.value[key] = !openMenus.value[key]
}

const navItems = [
  {
    name: 'Dashboard',
    to: '/',
    icon: LayoutDashboard,
    single: true,
  },
  {
    key: 'partnerships',
    name: 'Partnerships',
    icon: Handshake,
    single: false,
    children: [
      { name: 'Referrals', to: '/referrals', icon: Users },
      { name: 'Payouts & Billing', to: '/payouts', icon: Wallet },
    ],
  },
  {
    key: 'demos',
    name: 'UI Demos',
    icon: FlaskConical,
    single: false,
    children: [
      { name: 'Form Examples', to: '/form-example', icon: FileText },
      { name: 'Data Grid', to: '/grid-example', icon: TableProperties },
    ],
  },
]

function isChildActive(children: { to: string }[]) {
  return children.some((c) => route.path === c.to)
}

const sidebarWidth = computed(() => (sidebarCollapsed.value ? 'w-20' : 'w-64'))
const contentPadding = computed(() => (sidebarCollapsed.value ? 'lg:pl-20' : 'lg:pl-64'))

function closeSidebar() {
  sidebarOpen.value = false
}

function toggleCollapse() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function signOut() {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Mobile sidebar overlay -->
    <transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
        @click="closeSidebar"
      />
    </transition>

    <!-- Sidebar -->
    <aside
      class="fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-900 text-white transition-all duration-300 lg:translate-x-0"
      :class="[
        sidebarWidth,
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <!-- Logo -->
      <div class="flex h-16 items-center justify-between" :class="sidebarCollapsed ? 'px-4' : 'px-6'">
        <div class="flex items-center gap-2.5 overflow-hidden">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <span class="text-lg font-bold">Y</span>
          </div>
          <div v-if="!sidebarCollapsed" class="transition-opacity duration-200">
            <p class="text-sm font-bold leading-tight">Yeetiq Portal</p>
            <p class="text-xs text-slate-400">Partner Program</p>
          </div>
        </div>
        <button class="text-slate-400 hover:text-white lg:hidden" @click="closeSidebar">
          <X class="h-5 w-5" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="mt-4 flex-1 overflow-y-auto px-3">
        <p
          v-if="!sidebarCollapsed"
          class="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 transition-opacity duration-200"
        >
          Menu
        </p>
        <div v-else class="px-1 pb-2" />

        <div v-for="item in navItems" :key="item.name" class="mb-0.5">
          <!-- Single nav item (no children) -->
          <RouterLink
            v-if="item.single"
            :to="item.to!"
            class="group flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
            :class="[
              route.path === item.to
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white',
              sidebarCollapsed ? 'justify-center' : 'gap-3',
            ]"
            :title="sidebarCollapsed ? item.name : undefined"
            @click="closeSidebar"
          >
            <component :is="item.icon" class="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
            <span v-if="!sidebarCollapsed" class="transition-opacity duration-200">{{ item.name }}</span>
          </RouterLink>

          <!-- Group nav item with submenu -->
          <template v-else>
            <button
              class="group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200"
              :class="[
                isChildActive(item.children!)
                  ? 'text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                sidebarCollapsed ? 'justify-center' : 'gap-3',
              ]"
              :title="sidebarCollapsed ? item.name : undefined"
              @click="!sidebarCollapsed && toggleMenu(item.key!)"
            >
              <component
                :is="item.icon"
                class="h-5 w-5 shrink-0 transition-transform group-hover:scale-110"
                :class="isChildActive(item.children!) ? 'text-indigo-400' : ''"
              />
              <span v-if="!sidebarCollapsed" class="flex-1 text-left transition-opacity duration-200">
                {{ item.name }}
              </span>
              <ChevronDown
                v-if="!sidebarCollapsed"
                class="h-4 w-4 text-slate-500 transition-transform duration-200"
                :class="openMenus[item.key!] ? 'rotate-180' : ''"
              />
            </button>

            <!-- Submenu -->
            <transition
              enter-active-class="transition-all duration-200 ease-out"
              leave-active-class="transition-all duration-150 ease-in"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-40"
              leave-from-class="opacity-100 max-h-40"
              leave-to-class="opacity-0 max-h-0"
            >
              <div
                v-if="!sidebarCollapsed && openMenus[item.key!]"
                class="mt-0.5 overflow-hidden pl-4"
              >
                <div class="border-l border-slate-700/60 pl-3 space-y-0.5">
                  <RouterLink
                    v-for="child in item.children"
                    :key="child.to"
                    :to="child.to"
                    class="group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-all duration-150"
                    :class="
                      route.path === child.to
                        ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                        : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                    "
                    @click="closeSidebar"
                  >
                    <component :is="child.icon" class="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                    <span>{{ child.name }}</span>
                  </RouterLink>
                </div>
              </div>
            </transition>

            <!-- Collapsed state: show child icons directly -->
            <template v-if="sidebarCollapsed">
              <RouterLink
                v-for="child in item.children"
                :key="child.to"
                :to="child.to"
                class="group flex justify-center rounded-xl px-3 py-2 text-sm transition-all duration-200 mt-0.5"
                :class="
                  route.path === child.to
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                "
                :title="child.name"
                @click="closeSidebar"
              >
                <component :is="child.icon" class="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
              </RouterLink>
            </template>
          </template>
        </div>
      </nav>

      <!-- Collapse toggle -->
      <div class="px-3 py-2">
        <button
          class="group flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          :class="sidebarCollapsed ? 'justify-center' : 'gap-3'"
          :title="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="toggleCollapse"
        >
          <PanelLeftClose v-if="!sidebarCollapsed" class="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
          <PanelLeftOpen v-else class="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
          <span v-if="!sidebarCollapsed" class="transition-opacity duration-200">Collapse</span>
        </button>
      </div>

      <!-- User Profile Badge -->
      <div class="border-t border-slate-800 p-3">
        <div
          class="group flex items-center gap-3 rounded-xl bg-slate-800/50 p-3 transition-colors hover:bg-slate-800 cursor-pointer"
          :class="sidebarCollapsed ? 'justify-center' : ''"
          @click="signOut"
          :title="sidebarCollapsed ? 'Sign out' : undefined"
        >
          <AvatarInitials name="Carlos Cruz" size="sm" />
          <div v-if="!sidebarCollapsed" class="min-w-0 flex-1 transition-opacity duration-200">
            <p class="truncate text-sm font-medium text-white">Carlos Cruz</p>
            <p class="truncate text-xs text-slate-400">carlos@yeetiq.com</p>
          </div>
          <LogOut v-if="!sidebarCollapsed" class="h-4 w-4 text-slate-500 group-hover:text-slate-300 shrink-0 transition-colors" />
        </div>
      </div>
    </aside>

    <!-- Main content area -->
    <div class="transition-all duration-300" :class="contentPadding">
      <!-- Topbar -->
      <header
        class="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-200/60 bg-white/70 px-4 backdrop-blur-xl sm:px-6"
      >
        <button class="text-slate-600 hover:text-slate-900 lg:hidden" @click="sidebarOpen = true">
          <Menu class="h-6 w-6" />
        </button>

        <!-- Search -->
        <div class="relative flex-1 max-w-md">
          <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search referrals, payouts..."
            class="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-indigo-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div class="ml-auto flex items-center gap-2">
          <!-- Bell with unread dot -->
          <button
            class="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Bell class="h-5 w-5" />
            <span class="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-fuchsia-500 ring-2 ring-white" />
          </button>

          <!-- Settings -->
          <button
            class="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
          >
            <Settings class="h-5 w-5" />
          </button>
        </div>
      </header>

      <!-- Page content with fade transition -->
      <main class="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <RouterView v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </RouterView>
      </main>
    </div>

    <ToastContainer />
  </div>
</template>
