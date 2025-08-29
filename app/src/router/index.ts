import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/institution' },
  { path: '/institution', name: 'Institution', component: () => import('../views/Institution.vue') },
  { path: '/terms', name: 'Terms', component: () => import('../views/Terms.vue') },
  { path: '/programs', name: 'Programs', component: () => import('../views/Programs.vue') },
  { path: '/partners', name: 'Partners', component: () => import('../views/Partners.vue') },
  { path: '/users', name: 'Users', component: () => import('../views/Users.vue') },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router


