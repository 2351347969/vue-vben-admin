<script lang="ts" setup>
import type { Recordable } from '@vben-core/typings';

import type { VbenFormSchema } from '#/adapter/form';

import { h, ref } from 'vue';

import { useVbenModal, z } from '@vben/common-ui';
import { IconifyIcon } from '@vben/icons';
import { getPopupContainer } from '@vben/utils';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getMenuList, isMenuNameExists, saveUpdateUserApi } from '#/api';
import { $t } from '#/locales';
import { getMenuTypeOptions } from '#/views/menu/data';

const id = ref();

const [Modal, modalApi] = useVbenModal({
  class: 'custom-modal-width',
  draggable: true,
  title: '新增菜单',

  contentClass: 'custom-modal-width',
  footerClass: 'custom-modal-width',
  headerClass: 'custom-modal-width',

  // onCancel() {
  //   console.log(111)
  //   modalApi.close();
  // },
  // onConfirm: async () => {
  //   console.log("111")
  //   await formApi.validateAndSubmitForm();
  //   // modalApi.close();
  // },
  // onOpenChange(isOpen: boolean) {
  //   if (isOpen) {
  //     const values = modalApi.getData<Record<string, any>>();
  //     if (values) {
  //       formApi.setValues(values);
  //       if (values.id) {
  //         id.value = values.id;
  //         modalApi.setState({title: '编辑用户'});
  //       }
  //     }
  //   }
  // },
});
const formData = ref<SystemMenuApi.SystemMenu>();

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
const schema: VbenFormSchema[] = [
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: getMenuTypeOptions(),
      optionType: 'button',
    },
    defaultValue: 'menu',
    fieldName: 'type',
    formItemClass: 'col-span-2 md:col-span-2',
    label: '类型',
  },
  {
    component: 'Input',
    fieldName: 'name',
    label: '菜单名称',
    rules: z
      .string()
      // .min(2, $t('ui.formRules.minLength', [$t('system.menu.menuName'), 2]))
      // .max(30, $t('ui.formRules.maxLength', [$t('system.menu.menuName'), 30]))
      .refine(
        async (value: string) => {
          return !(await isMenuNameExists(value, formData.value?.id));
        },
        (value) => ({
          message: $t('ui.formRules.alreadyExists', [
            $t('system.menu.menuName'),
            value,
          ]),
        }),
      ),
  },
  {
    component: 'Input',
    fieldName: 'title',
    label: '标题',
  },
  {
    component: 'ApiTreeSelect',
    componentProps: {
      api: getMenuList,
      class: 'w-full',
      filterTreeNode(input: string, node: Recordable<any>) {
        if (!input || input.length === 0) {
          return true;
        }
        const title: string = node.meta?.title ?? '';
        if (!title) return false;
        return title.includes(input) || $t(title).includes(input);
      },
      getPopupContainer,
      labelField: 'meta.title',
      showSearch: true,
      treeDefaultExpandAll: true,
      valueField: 'id',
      childrenField: 'children',
    },
    fieldName: 'pid',
    label: '上级菜单',
    renderComponentContent() {
      return {
        title({ label, meta }: { label: string; meta: Recordable<any> }) {
          const coms = [];
          if (!label) return '';
          if (meta?.icon) {
            coms.push(h(IconifyIcon, { class: 'size-4', icon: meta.icon }));
          }
          coms.push(h('span', { class: '' }, $t(label || '')));
          return h('div', { class: 'flex items-center gap-1' }, coms);
        },
      };
    },
  },
  {
    component: 'Input',
    fieldName: 'title',
    label: '路由地址',
  },
  {
    component: 'IconPicker',
    componentProps: {
      prefix: 'carbon',
    },
    dependencies: {
      show: (values) => {
        return ['catalog', 'embedded', 'link', 'menu'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.icon',
    label: '图标',
  },
  {
    component: 'IconPicker',
    componentProps: {
      prefix: 'carbon',
    },
    dependencies: {
      show: (values) => {
        return ['catalog', 'embedded', 'menu'].includes(values.type);
      },
      triggerFields: ['type'],
    },
    fieldName: 'meta.activeIcon',
    label: '激活图标',
  },
  {
    component: 'Input',
    fieldName: 'title',
    label: '权限标识',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      buttonStyle: 'solid',
      options: [
        { label: $t('common.enabled'), value: 1 },
        { label: $t('common.disabled'), value: 0 },
      ],
      optionType: 'button',
    },
    defaultValue: 1,
    fieldName: 'status',
    label: '状态',
  },
  {
    component: 'InputNumber',
    fieldName: 'title',
    label: '排序',
  },
];
const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema,
  showDefaultActions: false,
});
</script>
<template>
  <Modal>
    <Form />
  </Modal>
</template>

<style lang="scss" scoped>
:deep(.custom-modal-width) {
  width: 800px !important; /* 固定宽度，!important 确保覆盖默认样式 */
  min-width: 600px; /* 最小宽度（避免屏幕缩小后过窄） */
  max-width: 90%; /* 最大宽度（避免超宽屏幕下过宽） */
  margin: 0 auto; /* 水平居中（默认已居中，可选） */
}
</style>
