import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/user/info');
}

export namespace DemoTableApi {
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    pageSize: number;
  }
}

export async function getUserListApi(params: DemoTableApi.PageFetchParams) {
  return requestClient.get('/user/list', { params });
}

export async function saveUpdateUserApi(data: any) {
  return requestClient.post('/user/save-update', data);
}
export async function deleteUserApi(data: any) {
  return requestClient.post('/user/delete', data);
}
