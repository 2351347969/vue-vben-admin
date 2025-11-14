<script lang="ts" setup>
import type { DataNode } from 'ant-design-vue/es/tree';

import type { Recordable } from '@vben/types';

import type { SystemRoleApi } from '#/api/core/role';

import { computed, nextTick, ref } from 'vue';

import { Tree, useVbenDrawer } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';

import { Spin } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getMenuList } from '#/api/core/menu';
import { saveUpdateRole } from '#/api/core/role';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emits = defineEmits(['success']);

const formData = ref<SystemRoleApi.SystemRole>();

const [Form, formApi] = useVbenForm({
  schema: useFormSchema(),
  showDefaultActions: false,
});

const permissions = ref<DataNode[]>([]);
const loadingPermissions = ref(false);

const id = ref();
const [Drawer, drawerApi] = useVbenDrawer({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) return;
    const values = await formApi.getValues();
    drawerApi.lock();

    console.log('values', values);
    saveUpdateRole({
      id: id.value,
      ...values,
      permissions: values.permissions.join(','),
    })
      .then(() => {
        emits('success');
        drawerApi.close();
      })
      .catch(() => {
        drawerApi.unlock();
      });
  },

  async onOpenChange(isOpen) {
    if (isOpen) {
      const data = drawerApi.getData<any>();
      formApi.resetForm();

      if (data) {
        formData.value = data;
        console.log('formData', formData.value);
        id.value = data.id;
      } else {
        id.value = undefined;
      }

      await loadPermissions();

      // 关键3：处理已选权限 ID 格式（核心修复）
      let selectedPermissions: number[] = [];
      if (formData.value?.permissions) {
        const permissionsRaw = formData.value.permissions;
        // 情况1：后端返回逗号分隔字符串（如 "1,2,3"）
        if (typeof permissionsRaw === 'string') {
          selectedPermissions = permissionsRaw
            .split(',')
            .filter(Boolean)
            .map(Number);
        }
        // 情况2：后端返回数组（如 ["1","2"] 或 [1,2]）
        else if (Array.isArray(permissionsRaw)) {
          selectedPermissions = permissionsRaw
            .map(Number)
            .filter((id) => !isNaN(id));
        }
        // 情况3：后端返回 menuIds 和 buttonIds 分开（需合并）
        // selectedPermissions = [
        //   ...(formData.value.menuIds?.split(',').map(Number) || []),
        //   ...(formData.value.buttonIds?.split(',').map(Number) || [])
        // ];
      }

      console.log('最终回显的权限ID数组：', selectedPermissions);
      console.log('Tree节点数据：', permissions.value);

      // 关键4：等待 DOM 渲染完成后，设置表单值（确保 Tree 已渲染节点）
      await nextTick();
      if (formData.value) {
        await formApi.setValues({
          ...formData.value,
          permissions: selectedPermissions, // 赋值处理后的 ID 数组（非硬编码）
        });
      }
    }
  },
});

async function loadPermissions() {
  loadingPermissions.value = true;
  try {
    const res = await getMenuList();
    permissions.value = res as unknown as DataNode[];
  } finally {
    loadingPermissions.value = false;
  }
}

const getDrawerTitle = computed(() => {
  return formData.value?.id
    ? $t('common.edit', $t('system.role.name'))
    : $t('common.create', $t('system.role.name'));
});

function getNodeClass(node: Recordable<any>) {
  const classes: string[] = [];
  if (node.value?.type === 'button') {
    classes.push('inline-flex');
  }

  return classes.join(' ');
}
</script>
<template>
  <Drawer :title="getDrawerTitle">
    <Form>
      <template #permissions="slotProps">
        <Spin :spinning="loadingPermissions" wrapper-class-name="w-full">
          <Tree
            :tree-data="permissions"
            multiple
            bordered
            :default-expanded-level="2"
            :get-node-class="getNodeClass"
            v-bind="slotProps"
            value-field="id"
            label-field="meta.title"
            icon-field="meta.icon"
            :value="slotProps.value"
            @change="slotProps.onChange"
          >
            <template #node="{ value }">
              <IconifyIcon v-if="value.meta.icon" :icon="value.meta.icon" />
              {{ $t(value.meta.title) }}
            </template>
          </Tree>
        </Spin>
      </template>
    </Form>
  </Drawer>
</template>
<style lang="css" scoped>
:deep(.ant-tree-title) {
  .tree-actions {
    display: none;
    margin-left: 20px;
  }
}

:deep(.ant-tree-title:hover) {
  .tree-actions {
    display: flex;
    flex: auto;
    justify-content: flex-end;
    margin-left: 20px;
  }
}
</style>
