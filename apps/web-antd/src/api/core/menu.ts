import type { RouteRecordStringComponent } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户所有菜单
 */
export async function getAllMenusApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/user/menus');
}

export async function getMenuList() {
  return requestClient.get<RouteRecordStringComponent[]>('/user/all-menus');
}
export async function isMenuNameExists() {
  return requestClient.get<RouteRecordStringComponent[]>('/user/all-menus');
}

export async function deleteMenu() {
  return requestClient.get<RouteRecordStringComponent[]>('/user/menus');
}

export async function SystemMenuApi() {
  return requestClient.get<RouteRecordStringComponent[]>('/user/all-menus');
}
