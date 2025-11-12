export function getMenuTypeOptions() {
  return [
    {
      color: 'processing',
      label: '目录',
      value: 'catalog',
    },
    { color: 'default', label: '菜单', value: 'menu' },
    { color: 'error', label: '按钮', value: 'button' },
    {
      color: 'success',
      label: '内嵌',
      value: 'embedded',
    },
    { color: 'warning', label: '外链', value: 'link' },
  ];
}
