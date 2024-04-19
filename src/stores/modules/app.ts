import { defineStore } from 'pinia';
import { store } from '../index';
import { isMp } from '@/utils';
import scssVars from '@styles/global.module.scss';
import type { ScssVars } from '@/types/global';

interface AppState {
  systemInfo?: UniNamespace.GetSystemInfoResult;
  menuBtnInfo?: UniNamespace.GetMenuButtonBoundingClientRectRes;
  scssVars: ScssVars;
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    systemInfo: undefined,
    menuBtnInfo: undefined,
    scssVars: scssVars as ScssVars,
  }),
  getters: {
    getSysInfo: state => state.systemInfo,
    getOsName: state => state.systemInfo?.osName as 'ios' | 'android' | 'windows' | 'mac' | 'linux',
    getStatusBarHeight: state => state.systemInfo?.statusBarHeight || 0,
    isAndroidMp: state => state.systemInfo?.osName === 'android' && isMp,
    isIOsMp: state => state.systemInfo?.osName === 'ios' && isMp,
    getScssVars: state => state.scssVars,
    getScreenWidth: state => state.systemInfo?.screenWidth,
    getFactor: state => (state.systemInfo?.screenWidth ? 750 / state.systemInfo?.screenWidth : 2), // 单位转换因子（设计稿 750，屏幕宽度 screenWidth(px)）
    getMenuInfoHeight: state => state.menuBtnInfo?.height,
    getSafeAreaInsets: state => state.systemInfo?.safeAreaInsets,
    // 导航栏高度 = 状态栏到胶囊的间距（胶囊上坐标位置-状态栏高度） * 2 + 胶囊高度 + 状态栏高度
    getNavBarHeight: state => {
      if (state.menuBtnInfo && state.systemInfo) {
        return (state.menuBtnInfo.top - state.systemInfo.statusBarHeight!) * 2 + state.menuBtnInfo.height + state.systemInfo.statusBarHeight!;
      }
      return 44;
    },
    // 标题栏高度（不包含 statusBar）= 状态栏到胶囊的间距（胶囊上坐标位置-状态栏高度） * 2 + 胶囊高度
    getHeaderHeight: state => {
      if (state.menuBtnInfo && state.systemInfo) {
        const height = (state.menuBtnInfo.top - state.systemInfo.statusBarHeight!) * 2 + state.menuBtnInfo.height;
        console.log(height, 'heightheight')
        return height
      }
      return 44;
    }
  },
  actions: {
    initSystemInfo() {
      // 如果缓存里有数据-就直接拿缓存里得值
      const storageSystemInfo = uni.getStorageSync('storageSystemInfo');
      // console.log(storageSystemInfo,'storageSystemInfo')
      // 获取系统信息
      this.systemInfo = storageSystemInfo || uni.getSystemInfoSync();
      // 胶囊按钮位置信息
      // this.menuBtnInfo = uni.getMenuButtonBoundingClientRect();
      // console.log(this.systemInfo, 'this.systemInfo.statusBarHeight')
      // let statusBarHeight = this.systemInfo.statusBarHeight;
      // // let headerHeight = this.systemInfo.head
      // if (statusBarHeight) {
      //   // console.log(statusBarHeight,'statusBarHeight')
      //   // 存入缓存-部距离手机顶部距离
      //   uni.setStorageSync('statusBarHeight', this.systemInfo.statusBarHeight)
      // }
      console.log(this.systemInfo,'this.systemInfo')
      uni.setStorageSync('storageSystemInfo',this.systemInfo) 
    },
  },
});

export const useAppStoreWithOut = () => {
  return useAppStore(store);
};
