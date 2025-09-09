import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useSessionStore } from "../stores/session";

const routes: RouteRecordRaw[] = [
  {
    path: "/account",
    name: "AccountOverview",
    component: () => import("../views/AccountOverview.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/account/settings",
    name: "AccountSettings",
    component: () => import("../views/AccountSettings.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/signin",
    name: "SignIn",
    component: () => import("../views/SignIn.vue"),
    meta: { public: true },
  },
  {
    path: "/",
    redirect: "/apps",
  },
  {
    path: "/apps",
    name: "Applications",
    component: () => import("../views/Applications.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/registrations",
    name: "Registrations",
    component: () => import("../views/Registrations.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/registrations/:id",
    name: "RegistrationDetail",
    component: () => import("../views/RegistrationDetail.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/consent/:token",
    name: "ParentConsent",
    component: () => import("../views/ParentConsent.vue"),
    meta: { public: true },
  },
  {
    path: "/admin/:tab?",
    name: "AdminLite",
    component: () => import("../views/AdminLite.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/high-schools/:id",
    name: "HighSchoolDetail",
    component: () => import("../views/HighSchoolDetail.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/programs/:id",
    name: "ProgramDetail",
    component: () => import("../views/ProgramDetail.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/terms/:id",
    name: "TermDetail",
    component: () => import("../views/TermDetail.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/courses/:id",
    name: "CourseDetail",
    component: () => import("../views/CourseDetail.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/admin/sections/:id",
    name: "SectionDetail",
    component: () => import("../views/SectionDetail.vue"),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const session = useSessionStore();
  const isPublic = to.meta.public === true;
  if (isPublic) return true;
  if (to.meta.requiresAuth && !session.isSignedIn) {
    return { path: "/signin", query: { next: to.fullPath } };
  }
  return true;
});

export default router




