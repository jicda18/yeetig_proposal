import { createRouter, createWebHashHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
  },
  {
    path: "/referrals",
    name: "referrals",
    component: () => import("../views/ReferralsView.vue"),
  },
  {
    path: "/payouts",
    name: "payouts",
    component: () => import("../views/PayoutsView.vue"),
  },
  {
    path: "/clients",
    name: "clients",
    component: () => import("../views/ClientsView.vue"),
  },
  {
    path: "/form-example",
    name: "form-example",
    component: () => import("../views/FormExampleView.vue"),
  },
  {
    path: "/grid-example",
    name: "grid-example",
    component: () => import("../views/GridExampleView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
