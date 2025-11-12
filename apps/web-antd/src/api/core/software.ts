import { requestClient } from '#/api/request';

export namespace DemoTableApi {
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    pageSize: number;
  }
}

export async function getSoftwareListApi(params: DemoTableApi.PageFetchParams) {
  return requestClient.get('/software/list', { params });
}
