<template>
  <div id="app">
    <SideMenu />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SideMenu from '@/components/SideMenu.vue'

export default defineComponent({
  name: 'App',
  components: {
    SideMenu
  }
})
</script>