<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

const data = ref();

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      data.value = modalApi.getData<Record<string, any>>();
    }
    //  console.info('isOpen', data.value);
  },
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    console.info('onConfirm');
  },
});
</script>
<template>
  <Modal title="组件抽离示例"> {{ data }} </Modal>
</template>
