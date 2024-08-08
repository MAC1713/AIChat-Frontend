import { createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import AIChatView from '@/views/AIChatView.vue'

const NotesView = () => import('@/views/NotesView.vue')



const routes: Array<RouteRecordRaw> = [
    {
      path: '/',
      name: 'home',
      component: AIChatView
    },
    {
      path: '/ai-chat',
      name: 'ai-chat',
      component: AIChatView
    },
    {
      path: '/notes',
      name: 'notes',
      component: NotesView
    },
  ]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
