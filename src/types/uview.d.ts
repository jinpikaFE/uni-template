declare module 'uview-plus';

// uview-plus 拓展了 uni 属性
interface Uni {
  $u: {
    config: Record<string, any>;
    os(): 'android' | 'ios';
    getSystemInfoSync(): UniNamespace.GetSystemInfoResult;
    platform: string;
    range(min: number, max: number, value: number): number;
    getPx(value: number | string, unit?: boolean): number;
    // TODO
  };
}
