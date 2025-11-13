<script lang="ts" setup>
import type { VxeGridProps } from '@vben/plugins/src/vxe-table/types';

import { onBeforeMount, ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { $t } from '@vben/locales';

import { Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteMenu, getMenuList } from '#/api/core/menu';

import { getMenuTypeOptions } from './data';
import ExtraModal from './model.vue';

// import Form from './modules/form.vue';
//
// const [FormDrawer, formDrawerApi] = useVbenDrawer({
//   connectedComponent: Form,
//   destroyOnClose: true,
// });

// 根节点加载状态（可选，优化体验）
const isRootLoading = ref(false);
const tableData = ref<any>([]); // 表格数据源（动态更新）

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: ExtraModal,
});

/**
 * 初始化加载根节点数据（parentId: null）
 */
const loadRootNodes = async () => {
  isRootLoading.value = true;
  const rootData = await getMenuList();
  tableData.value = rootData;
  gridApi.setGridOptions({
    data: tableData.value,
  });
  isRootLoading.value = false;
};

// -------------- 初始化加载 --------------
// 页面加载时自动加载根节点数据
onBeforeMount(async () => {
  await loadRootNodes();
});

const gridOptions: VxeGridProps<any> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    {
      align: 'left',
      field: 'title',
      fixed: 'left',
      slots: { default: 'title' },
      title: '标题',
      treeNode: true,
      width: 250,
    },
    {
      align: 'left',
      field: 'name',
      fixed: 'left',
      title: '菜单名称',
    },
    {
      align: 'center',
      cellRender: { name: 'CellTag', options: getMenuTypeOptions() },
      field: 'type',
      title: '类型',
      width: 100,
    },
    { field: 'authCode', title: '权限标识' },
    { field: 'path', title: '路由地址 ' },
    {
      align: 'left',
      field: 'component',
      formatter: ({ row }) => {
        switch (row.type) {
          case 'catalog':
          case 'menu': {
            return row.component ?? '';
          }
          case 'embedded': {
            return row.meta?.iframeSrc ?? '';
          }
          case 'link': {
            return row.meta?.link ?? '';
          }
        }
        return '';
      },
      minWidth: 200,
      title: '页面组件',
    },
    { field: 'meta.icon', title: '图标' },
    {
      cellRender: { name: 'CellTag' },
      field: 'status',
      title: '状态',
      width: 100,
    },
    {
      slots: { default: 'action' },
      title: '操作',
      fixed: 'right',
      minWidth: 150,
    },
  ],
  keepSource: true,
  data: tableData.value,
  pagerConfig: {
    enabled: false,
  },
  treeConfig: {
    parentField: 'pid',
    rowField: 'id',
    transform: false,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });

function openModal(data: any) {
  modalApi.setData({
    ...data,
    onSuccess: async () => {
      await loadRootNodes();
      message.info('保存成功'); // 只会执行一次
    },
  });
  modalApi.open();
}

function appendMenu(data: any) {
  modalApi.setData({
    pid: data.id,
    onSuccess: async () => {
      await loadRootNodes();
      message.info('保存成功'); // 只会执行一次
    },
  });
  modalApi.open();
}

function onDelete(row: any) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    duration: 0,
    key: 'action_process_msg',
  });
  deleteMenu({ id: row.id })
    .then(async () => {
      message.success({
        content: $t('ui.actionMessage.deleteSuccess', [row.name]),
        key: 'action_process_msg',
      });
      await loadRootNodes();
    })
    .catch(() => {
      hideLoading();
    });
}
</script>
<template>
  <Page auto-content-height>
    <!--  //  <FormDrawer @success="onRefresh" />-->
    <Grid>
      <template #action="{ row }">
        <Modal width="1000" />
        <Button type="link" @click="appendMenu(row)">新增下级</Button>
        <Button type="link" @click="openModal(row)">修改</Button>
        <Button type="link" danger @click="onDelete(row)">删除</Button>
      </template>

      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="openModal">
          新增菜单
        </Button>
      </template>
      <template #title="{ row }">
        <div class="flex w-full items-center gap-1">
          <div class="size-5 flex-shrink-0">
            <IconifyIcon
              v-if="row.type === 'button'"
              icon="carbon:security"
              class="size-full"
            />
            <IconifyIcon
              v-else-if="row.meta?.icon"
              :icon="row.meta?.icon || 'carbon:circle-dash'"
              class="size-full"
            />
          </div>
          <span class="flex-auto">{{ $t(row.meta?.title) }}</span>
          <div class="items-center justify-end"></div>
        </div>
      </template>
    </Grid>
  </Page>
</template>
<style lang="scss" scoped>
.menu-badge {
  top: 50%;
  right: 0;
  transform: translateY(-50%);

  & > :deep(div) {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
