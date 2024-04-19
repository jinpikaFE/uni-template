import '@/styles/common.scss';
import { createSSRApp } from 'vue';
import uviewPlus from 'uview-plus';
import App from './App.vue';

// 引入状态管理
import { setupStore, Pinia } from '@/stores';
import { setupGlobCom } from '@/components';
import UniRouteGuards from 'uniapp-route-guards';
// @ts-ignore
// #ifdef H5
import VConsole from 'vconsole';
// #endif

import 'uno.css';
import '@/styles/uni.scss';
import '@/styles/uview.scss';

// #ifdef H5
// 提交前需要注释  本地调试使用
const isProd = process.env.NODE_ENV === 'production';
!isProd && new VConsole();
// #endif

export function createApp() {
  const app = createSSRApp(App);
  setupStore(app);
  setupGlobCom(app);
  app.use(uviewPlus);

  app.use(UniRouteGuards);
  // uview 设置默认单位为 rpx
  // uni.$u.config.unit = 'rpx';
  const guard = new UniRouteGuards();
  guard.beforeEach((to: any, from: any, next: any) => {
    console.log('to: ', to);
    console.log('from: ', from);
    next();
  });

  return {
    app,
    Pinia,
  };
}
