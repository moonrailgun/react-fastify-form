import { CustomField } from './CustomField';

/**
 * 字段通用信息
 */
interface FastifyFormFieldCommon {
  name: string; // 字段名
  label?: string; // 字段标签
  defaultValue?: any; // 默认值
  [other: string]: any; // 其他字段
}

export interface FastifyFormFieldProps extends FastifyFormFieldCommon {
  value: any;
  error: string | undefined;
  onChange: (val: any) => void; // 修改数据的回调函数
}

/**
 * 字段组件
 */
export type FastifyFormFieldComponent<T = Record<string, unknown>> =
  React.ComponentType<FastifyFormFieldProps & T>;

const fieldMap = new Map<string, FastifyFormFieldComponent>();

/**
 * 注册组件
 */
export function regField(type: string, component: FastifyFormFieldComponent<any>) {
  fieldMap.set(type, component);
}

/**
 * 获取组件
 */
export function getField(
  type: string
): FastifyFormFieldComponent<any> | undefined {
  return fieldMap.get(type);
}

/**
 * 字段配置
 */
export interface FastifyFormFieldMeta extends FastifyFormFieldCommon {
  type: string; // 字段类型
}

// 内建字段
regField('custom', CustomField);
