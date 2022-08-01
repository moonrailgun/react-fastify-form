import React, { useLayoutEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import _isNil from 'lodash/isNil';
import _fromPairs from 'lodash/fromPairs';
import _isFunction from 'lodash/isFunction';
import _isEmpty from 'lodash/isEmpty';
import type { ObjectSchema } from 'yup';
import { FastifyFormContext } from './context';
import { getField, regField } from './field';
import type {
  FastifyFormFieldComponent,
  FastifyFormFieldProps,
  FastifyFormFieldMeta,
} from './field';
import { getFormContainer } from './container';

/**
 * 表单配置
 */
export interface FastifyFormProps<
  T extends Record<string, any> = Record<string, any>
> {
  fields: FastifyFormFieldMeta[]; // 字段详情
  schema?: ObjectSchema<any>; // yup schame object 用于表单校验
  layout?: 'horizontal' | 'vertical'; // 布局方式(默认水平)
  submitLabel?: string; // 提交按钮的标签名
  initialValues?: T;
  onSubmit?: (values: T) => Promise<void> | void; // 点击提交按钮的回调
  onChange?: (values: T) => void; // 数据更新回调
  extraProps?: Record<string, any>;
}

const _FastifyForm: React.FC<FastifyFormProps> = React.memo((props) => {
  const initialValues = useMemo(() => {
    return {
      ..._fromPairs(
        props.fields.map((field) => [field.name, field.defaultValue ?? ''])
      ),
      ...props.initialValues,
    };
  }, [props.fields, props.initialValues]);

  const [loading, setLoading] = useState(false);

  useLayoutEffect(() => {
    // 加载时提交一次initialValues
    typeof props.onChange === 'function' && props.onChange(initialValues);
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: props.schema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        _isFunction(props.onSubmit) && (await props.onSubmit(values));
      } finally {
        setLoading(false);
      }
    },
    validate: (values) => {
      _isFunction(props.onChange) && props.onChange(values);
    },
  });
  const { handleSubmit, setFieldValue, values, errors } = formik;

  const FastifyFormContainer = getFormContainer();

  if (_isNil(FastifyFormContainer)) {
    console.warn('FastifyFormContainer 没有被注册');
    return null;
  }

  const fieldsRender = useMemo(() => {
    return props.fields.map((fieldMeta, i) => {
      const fieldName = fieldMeta.name;
      const value = values[fieldName];
      const error = errors[fieldName];
      const Component = getField(fieldMeta.type);

      if (_isNil(Component)) {
        return null;
      } else {
        return (
          <Component
            key={fieldName + i}
            {...fieldMeta}
            value={value}
            error={error}
            onChange={(val: any) => setFieldValue(fieldName, val)}
          />
        );
      }
    });
  }, [props.fields, values, errors, setFieldValue]);

  return (
    <FastifyFormContext.Provider value={formik}>
      <FastifyFormContainer
        loading={loading}
        layout={props.layout ?? 'horizontal'}
        submitLabel={props.submitLabel ?? '提交'}
        handleSubmit={handleSubmit}
        canSubmit={_isEmpty(errors)}
        extraProps={props.extraProps}
      >
        {fieldsRender}
      </FastifyFormContainer>
    </FastifyFormContext.Provider>
  );
});
_FastifyForm.displayName = 'FastifyForm';

/**
 * 一个快速生成表单的组件
 * 用于通过配置来生成表单，简化通用代码
 */
export const FastifyForm = _FastifyForm as unknown as <
  T extends Record<string, any> = {}
>(
  props: FastifyFormProps<T>
) => React.ReactElement | null;

export { CustomField } from './CustomField';
export type {
  FastifyFormFieldComponent,
  FastifyFormFieldProps,
  FastifyFormFieldMeta,
};
export { regField };
export { regFormContainer } from './container';
export type {
  FastifyFormContainerComponent,
  FastifyFormContainerProps,
} from './container';
export { createFastifyFormSchema, fieldSchema } from './schema';
export { useFastifyFormContext } from './context';
