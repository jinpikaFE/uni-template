import axios, { type AxiosPromise } from 'axios';
import type { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
// @ts-ignore
import buildURL from 'axios/lib/helpers/buildURL';
import { identity, pickBy, throttle } from 'lodash-es';
import { stringify } from 'qs';
import { storage } from '@/utils';

type ParamsSerializer = AxiosRequestConfig['paramsSerializer'];

export function getFullURL(baseURL: string, url: string, params: Record<string, any>, paramsSerializer?: ParamsSerializer) {
  if (url.startsWith('http')) {
    return buildURL(url, params, paramsSerializer);
  }
  baseURL = baseURL.endsWith('/') ? baseURL : `${baseURL}/`;
  url = url.startsWith('/') ? url.slice(1) : url;
  return buildURL(`${baseURL}${url}`, params, paramsSerializer);
}

export function isPlainObject(obj: any) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * 跳转登陆页面，节流3s
 */
export const reLogin = throttle(
  () => {
    // uni.removeStorageSync('TOKEN');
    storage.removeRefreshToken();
    // globalStore.setAuthInfo(null);
    // globalStore.setGlobalInfo(null);
    // unLoginModalStore.setShow(true);
  },
  2000,
  { trailing: false },
);

export enum ContentType {
  default = 'application/x-www-form-urlencoded',
  json = 'application/json',
  formData = 'multipart/form-data',
}

const baseURL = import.meta.env.VITE_API_URL || '/';
export const instance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 60000,
  adapter: (config: AxiosRequestConfig): AxiosPromise => {
    const { url, method, data, params, headers, baseURL, responseType, withCredentials, paramsSerializer } = config;
    const reqParams = {
      method: method!.toUpperCase() as any,
      url: getFullURL(baseURL || '', url!, params, paramsSerializer),
      // header: { ...headers, 'content-type': 'application/json' },   之前这里为啥要写死 content-type
      header: { 'content-type': 'application/json', ...headers },
      data,
      dataType: 'json',
      responseType,
      withCredentials,
    };
    return new Promise((resolve, reject) => {
      uni.request({
        ...reqParams,
        success: (res: any) => {
          Object.assign(res, { request: { ...reqParams, fullUrl: reqParams.url, url } });
          resolve(res);
        },
        fail: (err: any) => {
          Object.assign(err, { request: { ...reqParams, fullUrl: reqParams.url, url } });
          reject(err);
        },
      });
    });
  },
});

instance.interceptors.request.use(
  config => {
    // 获取携带 access_token
    const token = storage.getAccessToken();
    if (token && !(config as any)?.notToken) {
      // config.url += (config.url?.includes('?') ? '&' : '?') + 'access_token=' + token;
      Object.assign(config.headers!, {
        Authorization: `Bearer ${token}`,
      });
    }
    // 每个请求头加上
    Object.assign(config.headers!, { version: '1.0.0' });

    if (config.url?.includes('/auth/token/refresh-token')) {
      delete config.headers['Authorization'];
    }
    return config;
  },
  error => {
    // Do something with request error
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  response => {
    const { data = {}, statusCode } = (response || {}) as any;
    const { url } = response.request || {};
    // const statusCode = response?.response?.status;
    // 不全局报错的路径
    const ignoreUrls = ['/auth/token/third-login'];
    // console.log((!data?.code && statusCode === 200),data.code,statusCode,'statusCodestatusCode')
    if (ignoreUrls.some(u => url.includes(u)) || (!data?.code && statusCode === 200)) {
      return data;
    }

    if (data?.code === 451) {
      uni.showToast({ title: data?.msg || '请您稍后再试，如仍无法解决，请联系工作人员处理', icon: 'none' });
      return Promise.reject(new Error(data?.msg || '业务异常'));
    }
    if (data?.code === 452) {
      uni.showToast({ title: data?.msg, icon: 'none' });
      uni.switchTab({ url: '/pages/course/index' });
      return Promise.reject(new Error(data?.msg));
    }
    // // token 失效
    // if (data?.code === 453) {
    //   return refreshToken(response as any).catch(err => {
    //     console.log('refreshToken err', err);
    //     // uni.showToast({ title: '身份验证失败', icon: 'none' });
    //   });
    // }

    /** 10010101 用户不存在重新登录 */
    if (data?.code === 401 || data?.code === 10010101) {
      reLogin();
      return Promise.reject(new Error(data?.msg || '登录失效'));
    }
    if ((data?.code && data?.code !== 200) || (!data?.code && statusCode !== 200)) {
      uni.showToast({ title: data?.msg || '请您稍后再试，如仍无法解决，请联系工作人员处理', icon: 'none' });
      return Promise.reject(new Error(data?.msg || 'Error'));
    }

    return data?.data;
  },
  error => {
    const statusCode = error?.response?.status;
    let message = error?.response?.data?.message || error?.response?.data?.msg;
    if (!message) {
      if (statusCode) {
        message = getErrMsgByStatus(statusCode);
      } else {
        message = getErrMsgByCode(error.code);
      }
    }

    const msgDisplay = getErrMsgFromEn(message) || '当前网络条件不佳，请检查或更换网络';
    if (statusCode !== 401) {
      uni.showToast({ title: msgDisplay, icon: 'none' });
    }

    if (statusCode === 401) {
      reLogin();
      throw new Error('请登录');
    }
    return Promise.reject(msgDisplay);
  },
);

/**
 * 请求公共方法
 *
 * @template T 返回结果类型
 * @param {Method} method 请求方法
 * @param {string} url 请求路径
 * @param {*} [data] data(POST, PATCH) 或者 query(GET)
 */
function request<T>(method: Method, url: string, data?: any, config?: AxiosRequestConfig) {
  let newUrl = url;
  if (method.toLowerCase() === 'get') {
    if (data && isPlainObject(data) && Object.keys(data).length) {
      // pickBy(data, identity) -- 去掉值为 null, undefined, '' 的
      newUrl = `${url}?${stringify(pickBy(data, (v: number | string) => Number.isInteger(v) || identity(v)))}`;
    }
  }
  return instance.request({ ...(config || {}), method, data, url: newUrl }) as Promise<T>;
}

// ** 一些特殊的英文错误显示成中文 **
function getErrMsgFromEn(msg: string) {
  if (typeof msg !== 'string') {
    return msg;
  }
  switch (true) {
    case msg?.includes('timeout of '):
      return '请求超时';
    case msg?.includes('Network Error'):
      return '网络错误';
    default:
      return msg;
  }
}

// ** 没有错误信息返回时，根据 status 状态码显示错误信息 **
function getErrMsgByStatus(status: number) {
  switch (status) {
    case 400:
      return '错误请求，服务器无法理解请求的格式';
    case 401:
      return '未授权，请求要求用户的身份认证';
    case 403:
      return '禁止访问';
    case 404:
      return '服务器无法根据客户端的请求找到资源';
    case 405:
      return '网络请求错误,请求方法未允许!';
    case 408:
      return '网络请求超时!';
    case 500:
      return '服务器内部错误，无法完成请求';
    case 502:
      return '网关错误';
    case 503:
      return '服务器目前无法使用（由于超载或停机维护）';
    case 504:
      return '网络超时!';
    case 505:
      return 'http版本不支持该请求!';
    default:
      return '未知错误';
  }
}

function getErrMsgByCode(code?: string): string {
  switch (code) {
    case 'ERR_BAD_OPTION_VALUE':
      return '选项设置了错误的值';
    case 'ERR_BAD_OPTION':
      return '无效的或不支持的选项';
    case 'ECONNABORTED':
      return '网络连接被中断，通常因为请求超时';
    case 'ETIMEDOUT':
      return '操作超时';
    case 'ERR_NETWORK':
      return '当前网络条件不佳，请检查或更换网络'; // '网络错误';
    case 'ERR_FR_TOO_MANY_REDIRECTS':
      return '请求被重定向了太多次，可能导致无限循环';
    case 'ERR_DEPRECATED':
      return '使用了已被废弃的函数或方法';
    case 'ERR_BAD_RESPONSE':
      return '从服务器接收到无效或错误的响应';
    case 'ERR_BAD_REQUEST':
      return '发送的请求格式错误或无效';
    case 'ERR_CANCELED':
      return '请求已经被取消';
    case 'ERR_NOT_SUPPORT':
      return '使用的某个功能或方法不被支持';
    case 'ERR_INVALID_URL':
      return '提供的URL无效';
    default:
      return '未知错误';
  }
}

export default request;
