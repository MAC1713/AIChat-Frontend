import { createRouter, createWebHistory } from 'vue-router'
import AIChatComponent from '@/components/AIChatComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'chat',
      component: AIChatComponent
    },
  ]
})

export default router
