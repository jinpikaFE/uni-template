import type { App } from 'vue';
import TabBar from './tab-bar/tab-bar.vue';
import CustomModal from './custom-modal/custom-modal.vue';

export const setupGlobCom = (app: App<Element>): void => {
  app.component('tab-bar', TabBar);
  app.component('custom-modal', CustomModal);
};
