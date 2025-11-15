<script lang="ts" setup>
import {ref} from 'vue';

import {useVbenModal} from '@vben/common-ui';

import {message} from 'ant-design-vue';

import {useVbenForm} from '#/adapter/form';
import {saveUpdateBlackUserApi} from '#/api/core/black';
import {saveUpdatePlatformApi} from "#/api/core/platform";
import {cloneDeep} from '@vben/utils';

const id = ref();

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  title: '新增平台',
  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.validateAndSubmitForm();
    // modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      id.value = null;
      const values = modalApi.getData<Record<string, any>>();
      if (values) {
        formApi.setValues(values);
        if (values.id) {
          id.value = values.id;
          modalApi.setState({title: '编辑平台'});
        }
      }
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  values.id = id.value;
  // data.platformConfig.interface = data.platformConfig.interfaceName;
  var data = cloneDeep(values);
  if (data.platformConfig.wallet && Array.isArray(data.platformConfig.wallet)) {
    data.platformConfig.wallet = data.platformConfig.wallet.join(','); // 数组转字符串（核心代码）
  }
  if (data.platformConfig.interfaceName) {
    data.platformConfig.interface = data.platformConfig.interfaceName;
    delete data.platformConfig.interfaceName
  }
  // const { interfaceName, ...新对象名 } = 原对象;
//  values.config.replaceAll('interfaceName', 'interface');
  data.config = data.platformConfig ? JSON.stringify(data.platformConfig) : '{}';
  console.log("提交参数", data)
  await saveUpdatePlatformApi(data);
  message.info('保存成功'); // 只会执行一次
  // 获取并调用成功回调
  const data1 = modalApi.getData<Record<string, any>>();
  if (data1?.onSuccess) {
    data1.onSuccess();
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
      fieldName: 'platform',
      label: '平台名称',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        class: 'w-full',
        placeholder: '请输入',
      },
      fieldName: 'type',
      label: '模板类型',
      defaultValue: 0,
      rules: 'required',
    },

    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'platformConfig.interfaceName',
      label: '接口地址',
       rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        options: [
          {
            label: 'https',
            value: 'https://',
          },
          {
            label: 'http',
            value: 'http://',
          },
        ],
      },
      fieldName: 'platformConfig.protocol',
      label: '协议',
      defaultValue: 'https://',
      rules: 'required',
    },
    // {
    //   component: 'Input',
    //   componentProps: {
    //     placeholder: '请输入',
    //   },
    //   fieldName: 'platformConfig.wallet',
    //   label: '钱包类型',
    // },

    {
      component: 'CheckboxGroup',
      componentProps: {
        name: 'cname',
        options: [
          {
            label: '汇付',
            value: '汇付',
          },
          {
            label: '易宝',
            value: '易宝',
          },
          {
            label: '快付通',
            value: '快付通',
          },
          {
            label: '余额',
            value: '余额',
          },
        ],
      },
      fieldName: 'platformConfig.wallet',
      label: '钱包类型',
      defaultValue: ['汇付'],
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      dependencies: {
        show: (values) => {
          return [10].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'platformConfig.appName',
      label: 'appName',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      dependencies: {
        show: (values) => {
          return [10].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'platformConfig.appType',
      label: 'appType',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      dependencies: {
        show: (values) => {
          return [10].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'platformConfig.tag',
      label: 'tag',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      dependencies: {
        show: (values) => {
          return [0].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'platformConfig.syncId',
      label: 'syncId',
      defaultValue: 1,
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      dependencies: {
        show: (values) => {
          return [1].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'platformConfig.code',
      label: 'code',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      dependencies: {
        show: (values) => {
          return [3].includes(values.type);
        },
        triggerFields: ['type'],
      },
      fieldName: 'platformConfig.logoutKey',
      label: 'logoutKey',
    },
  ],
  showDefaultActions: false,
});
</script>
<template>
  <Modal>
    <Form/>
  </Modal>
</template>
