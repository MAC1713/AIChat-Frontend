import { defineStore } from 'pinia';

// 创建一个全局点击处理器的闭包，以便在组件卸载时清除监听器
let globalClickListener: { (this: Document, ev: MouseEvent): any; (event: any): void; (this: Document, ev: MouseEvent): any; (this: Document, ev: MouseEvent): any; } | undefined;

export const useUIStore = defineStore('ui', {
  state: () => ({
    isMenuOpen: false,
  }),
  getters: {
    // 可选：添加getter来获取菜单状态，方便在组件中直接使用
    menuState: (state) => state.isMenuOpen,
  },
  actions: {
    toggleMenu() {
      this.isMenuOpen = !this.isMenuOpen;
      
      // 如果菜单打开，重新绑定全局点击事件监听器
      if (this.isMenuOpen) {
        this.attachGlobalClickListener();
      } else {
        // 如果菜单关闭，移除全局点击事件监听器
        if (globalClickListener) {
          document.removeEventListener('click', globalClickListener);
          globalClickListener = undefined;
        }
      }
    },

    attachGlobalClickListener() {
      // 定义点击事件处理函数
      globalClickListener = (event) => {
        // 确保点击目标不是菜单自身的一部分，也不是菜单按钮
        const menuElement = document.querySelector('.side-menu');
        const menuButton = document.querySelector('.menu-button');
        
        // 如果点击的目标既不是菜单也不是菜单按钮，则关闭菜单
        if (
          !menuElement?.contains(event.target) &&
          !menuButton?.contains(event.target)
        ) {
          this.closeMenu();
        }
      };

      // 绑定到document上监听全局点击
      document.addEventListener('click', globalClickListener);
    },

    closeMenu() {
      this.isMenuOpen = false;
      // 移除全局点击事件监听器，以防万一
      if (globalClickListener) {
        document.removeEventListener('click', globalClickListener);
        globalClickListener = undefined;
      }
    },
  },
});