import type { ComponentType } from 'react';

/**
 * 容器配置
 */
export interface FastifyFormContainerProps<
  T extends Record<string, any> = Record<string, any>
> {
  loading: boolean;
  submitLabel?: string;

  layout?: 'horizontal' | 'vertical';

  /**
   * 是否允许提交
   */
  canSubmit?: boolean;
  handleSubmit: () => void;
  children?: React.ReactNode;

  extraProps?: T;
}
export type FastifyFormContainerComponent =
  React.ComponentType<FastifyFormContainerProps>;
let FastifyFormContainer: FastifyFormContainerComponent;
export function regFormContainer(component: FastifyFormContainerComponent) {
  FastifyFormContainer = component;
}

export function getFormContainer():
  | ComponentType<FastifyFormContainerProps>
  | undefined {
  return FastifyFormContainer;
}
