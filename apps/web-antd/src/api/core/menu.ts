import type {RouteRecordStringComponent} from '@vben/types';

import {requestClient} from '#/api/request';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/menu/menus');
}

export async function getMenuList() {
  return requestClient.get<RouteRecordStringComponent[]>('/menu/all-menus');
}

export async function isMenuNameExists(params: any) {
  return requestClient.get<RouteRecordStringComponent[]>('/menu/menu-exist', {params});
}

export async function deleteMenu(data:any) {
  return requestClient.post<RouteRecordStringComponent[]>('/menu/delete', data);
}

export async function saveUpdateMenu(data: any) {
  return requestClient.post<RouteRecordStringComponent[]>('/menu/save-update', data);
}

export async function SystemMenuApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/user/all-menus');
}
