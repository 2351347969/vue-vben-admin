<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import {getAllMenusApi, getMenuList, saveUpdateUserApi} from '#/api';
import {getAllRoles} from "#/api/core/role";

const id = ref();

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  title: '新增用户',
  onCancel() {
    console.log(111);
    modalApi.close();
  },
  onConfirm: async () => {
    console.log('111');
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const values = modalApi.getData<Record<string, any>>();
      if (values) {
        formApi.setValues(values);
        if (values.id) {
          id.value = values.id;
          modalApi.setState({ title: '编辑用户' });
        }
      }
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  values.id = id.value;
  await saveUpdateUserApi(values);

  message.info('保存成功'); // 只会执行一次

  // 获取并调用成功回调
  const data = modalApi.getData<Record<string, any>>();
  if (data?.onSuccess) {
    data.onSuccess();
  }
  modalApi.close();
}

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'nickname',
      label: '昵称',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'phone',
      label: '手机号',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'password',
      label: '密码',
      rules: 'required',
    },

    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'qq',
      label: 'qq',
    },

    {
      component: 'DatePicker',
      componentProps: {
        class: 'w-full',
        placeholder: '请输入',
        valueFormat: 'YYYY-MM-DD HH:mm:ss',
        showTime: { hour: true, minute: true, second: true },
      },
      fieldName: 'expire',
      label: '过期时间',
    },

    // {
    //   component: 'InputNumber',
    //   componentProps: {
    //     placeholder: '请输入',
    //   },
    //   fieldName: 'ismul',
    //   label: '多开数量',
    // },
    //
    // {
    //   component: 'RadioGroup',
    //   componentProps: {
    //     options: [
    //       {
    //         label: '是',
    //         value: 1,
    //       },
    //       {
    //         label: '否',
    //         value: 0,
    //       },
    //     ],
    //   },
    //   fieldName: 'isadmin',
    //   label: '管理员',
    // },

    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'ApiSelect',
      // 对应组件的参数
      componentProps: {
        class: 'w-full',
        // 菜单接口转options格式
        afterFetch: (data: { name: string; path: string }[]) => {
          return data.map((item: any) => ({
            label: item.name,
            value: item.id,
          }));
        },
        // 菜单接口
        api: getAllRoles,
        autoSelect: 'first',
      },
      // 字段名
      fieldName: 'roleId',
      // 界面显示的label
      label: '角色',
    },
  ],
  showDefaultActions: false,
});
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>
