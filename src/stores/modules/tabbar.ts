import { defineStore } from 'pinia';

export const useTabbarStore = defineStore('tabbar', {
  state: () => ({
    selectedPage: '/pages/dynamic/index',
  }),
  getters: {
    getSelectedPage: state => state.selectedPage,
  },
  actions: {
    setSelectedPage(page: string) {
      this.selectedPage = page;
    },
  },
});
