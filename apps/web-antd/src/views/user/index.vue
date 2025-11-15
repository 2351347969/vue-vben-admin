<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';

import { Modal as antModel, Button, message } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteUserApi, getUserListApi } from '#/api';

import ExtraModal from './model.vue';

const [Modal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: ExtraModal,
});

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}

const formOptions: VbenFormProps = {
  // 默认展开
  collapsed: false,
  schema: [
    {
      component: 'Input',
      //  defaultValue: '1',
      fieldName: 'nickname',
      label: '昵称',
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '手机号',
    },
    {
      component: 'Input',
      fieldName: 'qq',
      label: 'qq',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: '是',
            value: 1,
          },
          {
            label: '否',
            value: 0,
          },
        ],
        placeholder: '请选择',
      },
      fieldName: 'expire',
      label: '是否过期',
      defaultValue: 0,
    },
    // {
    //   component: 'DatePicker',
    //   fieldName: 'datePicker',
    //   label: '创建时间',
    // },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
  // 是否在字段值改变时提交表单
  submitOnChange: true,
  // 按下回车时是否提交表单
  submitOnEnter: false,
};

const gridOptions: VxeTableGridOptions<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', minWidth: 50 },
    // { align: 'left', title: 'Name', type: 'checkbox', width: 100 },
    { field: 'nickname', title: '昵称', minWidth: 100 },
    { field: 'phone', title: '手机号', minWidth: 120 },
    { field: 'password', title: '密码', minWidth: 120 },
    { field: 'recentOnline', title: '最近登录', minWidth: 150 },
    { field: 'expire', title: '过期时间', minWidth: 150 },
    // { field: 'expire', formatter: 'formatDateTime', title: '创建时间' },
    {
      slots: { default: 'action' },
      title: '操作',
      fixed: 'right',
      minWidth: 150,
    },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        //  message.success(`Query params: ${JSON.stringify(formValues)}`);
        return await getUserListApi({
          page: page.currentPage - 1,
          size: page.pageSize,
          ...formValues,
        });
      },
    },
    response: {
      total: 'totalCount',
      result: 'dataList',
      list: 'dataList',
    },
  },
  toolbarConfig: {
    custom: true,
    export: true,
    refresh: true,
    resizable: true,
    search: true,
    zoom: true,
  },
  editConfig: {
    mode: 'row',
    trigger: 'click',
  },
  rowConfig: {
    isHover: true,
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

function openModal(data: any) {
  modalApi.setData({
    ...data,
    onSuccess: () => {
      // message.success('保存成功');
      gridApi.reload();
    },
  });
  modalApi.open();
}

function deleteUser(data: any) {
  antModel.confirm({
    title: '确认删除',
    content: `确定要删除用户 "${data.nickname}" 吗？此操作不可恢复！`,
    okText: '确认',
    cancelText: '取消',
    centered: true,
    onOk: async () => {
      try {
        // 在这里调用删除用户的API
        await deleteUserApi({ id: data.id });
        message.success('用户删除成功');
        gridApi.reload(); // 删除成功后刷新表格
      } catch (error) {
        message.error(`删除失败: ${error.message}`);
      }
    },
    onCancel() {
      // 用户取消删除，无需操作
    },
  });
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #action="{ row }">
        <Modal />
        <Button type="link" @click="openModal(row)">编辑</Button>
        <Button type="link" danger @click="deleteUser(row)">删除</Button>
      </template>

      <template #toolbar-tools>
        <Button class="mr-2" type="primary" @click="openModal">
          新增用户
        </Button>
      </template>
    </Grid>
  </Page>
</template>
