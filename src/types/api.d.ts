declare type MapType = {
  left: number | string | any; // id
  right: any;
};

// 请求分页
declare type QueryListParams = {
  current?: number;
  size?: number;
  keyword?: string;
  order?: 'asc' | 'desc'; // 排序方式
  prop?: string; // 排序属性
  startTime?: string;
  endTime?: string;
  status?: number | string; //筛选状态
  payStatus?: number
};

// 接口返回公用基础信息
declare type BaseResultInfo = {
  id?: number | string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: Date;
  isDeleted?: 0 | 1; // 1 删除 0 正常
};

declare type ApiResponse<T = any> = {
  code: number;
  data?: T;
  msg?: string;
  time?: number;
};

declare type PageData<T> = {
  records: T[];
  total: number;
};

declare type EffectResponse<T = {}> = { result: boolean } & ApiResponse<T>;
declare type EffectResponseBlob = { result: boolean; data: Blob };
