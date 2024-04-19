<template>
  <uni-transition mode-class="fade" :duration="200" :show="true">
    <view class="tabbar" :style="`padding-bottom: ${safeAreaInsets?.bottom || 0}px;`">
      <view ref="wrapper" class="wrapper">
        <view ref="navItem" class="navigator-item" v-for="(item, index) in list" :key="item.pagePath" @click="switchTab(item)" :data-index="index">
          <image class="w-[54rpx] h-[54rpx]" :src="tabbarStore.getSelectedPage === item.pagePath ? item?.selectedIconPath : item?.iconPath" />
          <view :class="['item-text', { 'text-active': tabbarStore.getSelectedPage === item.pagePath }]">{{ item.text }}</view>
        </view>
      </view>
    </view>
  </uni-transition>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, onUnmounted } from 'vue';
import { useAppStore } from '@/stores/modules/app';
import { onShow, onUnload } from '@dcloudio/uni-app';
import { useTabbarStore } from '@/stores/modules/tabbar';

const appStore = useAppStore();
const tabbarStore = useTabbarStore();
const safeAreaInsets = computed(() => appStore.getSafeAreaInsets);

type ListItem = {
  text: string;
  pagePath: string;
  iconPath: string;
  selectedIconPath: string;
};
const list: ListItem[] = [
  {
    pagePath: '/pages/home/index',
    iconPath: '/static/imgs/icon_home_inactive.png',
    selectedIconPath: '/static/imgs/icon_home_active.png',
    text: '首页',
  },
  {
    pagePath: '/pages/mine/index',
    iconPath: '/static/imgs/icon_mine_inactive.png',
    selectedIconPath: '/static/imgs/icon_mine_active.png',
    text: '我的',
  },
];
onShow(() => {
  const pages = getCurrentPages();

  // 获取当前页面信息
  const currentPage = pages[pages.length - 1];

  // 获取当前路由
  const currentRoute = currentPage.route;
  tabbarStore.setSelectedPage(`/${currentRoute}`);
});
function switchTab(item: ListItem) {
  const url = item.pagePath;
  uni.switchTab({ url });
  tabbarStore.setSelectedPage(item.pagePath);
}
</script>

<style scoped lang="scss">
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  // height: 100rpx;
  z-index: 999;
  background: #ffffff;
  border-top: 2rpx solid #eee;

  .wrapper {
    display: flex;
    justify-content: space-between;
    width: auto;
    transition-timing-function: ease-out;
    height: 100%;

    .navigator-item {
      flex: 1;
      height: 100%;
      padding-top: 15rpx;
      padding-bottom: 15rpx;
      text-align: center;
    }

    .item-text {
      color: #c8c8c8;
      font-size: 24rpx;
    }

    .text-active {
      color: #1349c9 !important;
      font-weight: bold;
    }
  }
}
</style>
