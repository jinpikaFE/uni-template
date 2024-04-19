import type { App } from 'vue';
import * as Pinia from 'pinia';

const store = Pinia.createPinia();

export const setupStore = (app: App<Element>) => {
  app.use(store);
};

export { store, Pinia };
