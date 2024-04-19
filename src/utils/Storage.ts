/**
 * 创建本地缓存对象
 * @param {string=} prefixKey -
 */
export const createStorage = ({ prefixKey = '' } = {}) => {
  /**
   * 本地缓存类
   * @class Storage
   */
  const Storage = class {
    private prefixKey?: string = prefixKey;

    private getKey(key: string) {
      return `${this.prefixKey}${key}`.toUpperCase();
    }

    /**
     * @description 设置缓存
     * @param {string} key 缓存键
     * @param {*} value 缓存值
     * @param expire 秒级 多少秒后过期
     */
    set(key: string, value: any, expire: number | null = null) {
      const stringData = JSON.stringify({
        value,
        expire: expire !== null ? new Date().getTime() + expire * 1000 : null,
      });
      uni.setStorageSync(this.getKey(key), stringData);
    }

    /**
     * 读取缓存
     * @param {string} key 缓存键
     * @param {*=} def 默认值
     */
    get(key: string, def: any = null) {
      const item = uni.getStorageSync(this.getKey(key));
      if (item) {
        try {
          const data = JSON.parse(item);
          const { value, expire } = data;
          // 在有效期内直接返回
          if (expire === null || expire >= Date.now()) {
            return value;
          }
          this.remove(this.getKey(key));
        } catch (e) {
          return def;
        }
      }
      return def;
    }

    /**
     * 从缓存删除某项
     * @param {string} key
     */
    remove(key: string) {
      uni.removeStorageSync(this.getKey(key));
    }

    /**
     * 清空所有缓存
     * @memberOf Cache
     */
    clear(): void {
      uni.clearStorageSync();
    }
  };
  return new Storage();
};

export const storage = createStorage();

export default Storage;
