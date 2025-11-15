import { requestClient } from '#/api/request';

export namespace DemoTableApi {
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    pageSize: number;
  }
}

export async function getPlatformList(params: DemoTableApi.PageFetchParams) {
  return requestClient.get('/platform/list', { params });
}

export async function saveUpdatePlatformApi(data: any) {
  return requestClient.post('/platform/save-update', data);
}
export async function deletePlatformApi(data: any) {
  return requestClient.post('/platform/delete', data);
}
