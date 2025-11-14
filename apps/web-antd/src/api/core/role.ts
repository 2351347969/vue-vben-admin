import type { Recordable, RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace SystemRoleApi {
  export interface SystemRole {
    [key: string]: any;
    id: string;
    name: string;
    permissions: number[];
    remark?: string;
    status: 0 | 1;
  }
}

/**
 * 获取角色列表数据
 */
async function getRoleList(params: Recordable<any>) {
  return requestClient.get<Array<SystemRoleApi.SystemRole>>('/role/list', {
    params,
  });
}

/**
 * 创建角色
 * @param data 角色数据
 */
async function createRole(data: Omit<SystemRoleApi.SystemRole, 'id'>) {
  return requestClient.post('/system/role', data);
}

export async function saveUpdateRole(data: any) {
  return requestClient.post<RouteRecordStringComponent[]>(
    '/role/save-update',
    data,
  );
}

export async function getAllRoles(data: any) {
  return requestClient.get('/role/roles', data);
}

/**
 * 删除角色
 * @param id 角色 ID
 */
async function deleteRole(data: any) {
  return requestClient.post('/role/delete', data);
}

export { createRole, deleteRole, getRoleList };
