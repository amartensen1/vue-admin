import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useSessionStore } from "../stores/session";

const routes: RouteRecordRaw[] = [
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




