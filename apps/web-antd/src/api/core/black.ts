import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';



export namespace DemoTableApi {
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    pageSize: number;
  }
}

export async function getBlackUserList(params: DemoTableApi.PageFetchParams) {
  return requestClient.get('/black-user/list', { params });
}

export async function saveUpdateBlackUserApi(data: any) {
  return requestClient.post('/black-user/save-update', data);
}
export async function deleteBlackUserApi(data: any) {
  return requestClient.post('/black-user/delete', data);
}
