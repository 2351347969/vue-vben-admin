import type {VbenFormSchema} from '#/adapter/form';
import type {OnActionClickFn, VxeTableGridOptions} from '#/adapter/vxe-table';
import type {SystemRoleApi} from '#/api';
import {AccessControl, useAccess} from '@vben/access';

const {hasAccessByCodes} = useAccess();
import {$t} from '#/locales';

export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.role.roleName'),
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'code',
      label: '编码',
      rules: 'required',
    },
    {
      component: 'RadioGroup',
      componentProps: {
        buttonStyle: 'solid',
        options: [
          {label: $t('common.enabled'), value: 1},
          {label: $t('common.disabled'), value: 0},
        ],
        optionType: 'button',
      },
      defaultValue: 1,
      fieldName: 'status',
      label: $t('system.role.status'),
    },
    {
      component: 'Textarea',
      fieldName: 'remark',
      label: $t('system.role.remark'),
    },
    {
      component: 'Input',
      fieldName: 'permissions',
      formItemClass: 'items-start',
      label: $t('system.role.setPermissions'),
      modelPropName: 'modelValue',
      defaultValue: [], // 默认空数组
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'name',
      label: $t('system.role.roleName'),
    },
    {component: 'Input', fieldName: 'code', label: '角色编码'},
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          {label: $t('common.enabled'), value: 1},
          {label: $t('common.disabled'), value: 0},
        ],
      },
      fieldName: 'status',
      label: $t('system.role.status'),
    },
    {
      component: 'Input',
      fieldName: 'remark',
      label: $t('system.role.remark'),
    },
    {
      component: 'RangePicker',
      fieldName: 'createTime',
      label: $t('system.role.createTime'),
    },
  ];
}

export function useColumns<T = SystemRoleApi.SystemRole>(
  onActionClick: OnActionClickFn<T>,
  onStatusChange?: (newStatus: any, row: T) => PromiseLike<boolean | undefined>,
): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'name',
      title: $t('system.role.roleName'),
      width: 200,
    },
    {
      field: 'code',
      title: '角色编码',
      width: 200,
    },
    {
      cellRender: {
        attrs: {beforeChange: onStatusChange},
        name: onStatusChange ? 'CellSwitch' : 'CellTag',
      },
      field: 'status',
      title: $t('system.role.status'),
      width: 100,
    },
    {
      field: 'remark',
      minWidth: 100,
      title: $t('system.role.remark'),
    },
    {
      field: 'createdAt',
      title: $t('system.role.createTime'),
      width: 200,
    },
    {
      align: 'center',
      cellRender: {
        attrs: {
          nameField: 'name',
          nameTitle: $t('system.role.name'),
          onClick: onActionClick,

        },
        options: [
          {code: 'edit', show: hasAccessByCodes(['RoleEdit'])}, //
          {code: 'delete', show: hasAccessByCodes(['RoleDelete'])} // 隐藏删除按钮
        ],
        name: 'CellOperation',
      },
      field: 'operation',
      fixed: 'right',
      title: $t('system.role.operation'),
      width: 130,
    },
  ];
}
