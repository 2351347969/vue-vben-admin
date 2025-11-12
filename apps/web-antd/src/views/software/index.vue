<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { Page, useVbenModal } from '@vben/common-ui';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getSoftwareListApi } from '#/api/core/software';

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
      fieldName: 'platform',
      label: '平台',
    },
    {
      component: 'Input',
      fieldName: 'phone',
      label: '手机号',
    },
    {
      component: 'Input',
      fieldName: 'goodsName',
      label: '藏品名称',
    },
    // {
    //   component: 'Select',
    //   componentProps: {
    //     allowClear: true,
    //     options: [
    //       {
    //         label: '永久',
    //         value: 0,
    //       },
    //       {
    //         label: '免费',
    //         value: 4,
    //       },
    //     ],
    //     placeholder: '请选择',
    //   },
    //   fieldName: 'type',
    //   label: '类型',
    // },
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
    { title: '序号', type: 'seq', width: 50 },
    // { align: 'left', title: 'Name', type: 'checkbox', width: 100 },
    { field: 'platform', title: '平台' },
    { field: 'version', title: '版本' },
    { field: 'vipName', title: '使用人' },
    { field: 'tid', title: '藏品id' },
    { field: 'phone', title: '手机号' },
    { field: 'goodsName', title: '藏品名称' },
    { field: 'price', title: '价格' },
    { field: 'date', title: '时间' },
    { field: 'status', title: '状态' },
    { field: 'wxid', title: '登录ID' },
    // { field: 'expire', formatter: 'formatDateTime', title: '创建时间' },
    { slots: { default: 'action' }, title: '操作' },
  ],
  exportConfig: {},
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        //  message.success(`Query params: ${JSON.stringify(formValues)}`);
        return await getSoftwareListApi({
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
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });
function openModal(data: any) {
  modalApi.setData(data);
  modalApi.open();
}

// const [Grid] = useVbenVxeGrid({
//   formOptions,
//   gridOptions,
// });
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #action="{ row }">
        <Modal />
        <Button type="link" @click="openModal(row)">编辑</Button>
      </template>
    </Grid>
  </Page>
</template>
