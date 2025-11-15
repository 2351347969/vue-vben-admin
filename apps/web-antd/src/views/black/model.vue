<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { saveUpdateBlackUserApi } from '#/api/core/black';

const id = ref();

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  title: '新增黑名单用户',
  onCancel() {
    console.log(111);
    modalApi.close();
  },
  onConfirm: async () => {
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
          modalApi.setState({ title: '编辑黑名单用户' });
        }
      }
    }
  },
});

async function onSubmit(values: Record<string, any>) {
  values.id = id.value;
  await saveUpdateBlackUserApi(values);

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
      fieldName: 'account',
      label: '账号',
      rules: 'required',
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'reason',
      label: '原因',
    },

    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'op',
      label: '来源',
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
