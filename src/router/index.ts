import { createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import AIChatView from '@/views/AIChatView.vue'
import PromptsView from '@/views/PromptsView.vue';
import UnderConstruction from '@/views/UnderConstruction.vue'

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
    {
      path: '/prompts',
      name: 'prompts',
      component: PromptsView,
    },
    {
      path: '/under-construction',
      name: 'under-construction',
      component: UnderConstruction
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/under-construction'
    }
  ]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
