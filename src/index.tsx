import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Field, FieldProps, FormikProvider, useFormik } from 'formik';
import _isNil from 'lodash/isNil';
import _fromPairs from 'lodash/fromPairs';
import _isFunction from 'lodash/isFunction';
import _isEmpty from 'lodash/isEmpty';
import type { ObjectSchema } from 'yup';
import { getField, regField } from './field';
import type {
  FastifyFormFieldComponent,
  FastifyFormFieldProps,
  FastifyFormFieldMeta,
} from './field';
import { getFormContainer } from './container';

export interface DefaultFastifyFormExtraProps {}

/**
 * 表单配置
 */
export interface FastifyFormProps<
  T extends Record<string, any> = Record<string, any>,
  K extends Record<string, any> = DefaultFastifyFormExtraProps
> {
  fields: FastifyFormFieldMeta[]; // 字段详情
  schema?: ObjectSchema<any>; // yup schame object 用于表单校验
  layout?: 'horizontal' | 'vertical'; // 布局方式(默认水平)
  submitLabel?: string; // 提交按钮的标签名
  initialValues?: T;
  onSubmit?: (values: T) => Promise<void> | void; // 点击提交按钮的回调
  onChange?: (values: T) => void; // 数据更新回调
  extraProps?: K;
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

  const handleValuesChange = useCallback((values: Record<string, any>) => {
    _isFunction(props.onChange) && props.onChange(values);
  }, []);

  const formik = useFormik({
    initialValues,
    validationSchema: props.schema,
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false, // 移除默认行为，全改为手动触发
    onSubmit: async (values) => {
      setLoading(true);
      try {
        _isFunction(props.onSubmit) && (await props.onSubmit(values));
      } finally {
        setLoading(false);
      }
    },
  });
  const { handleSubmit, errors, setFieldValue } = formik;

  const FastifyFormContainer = getFormContainer();

  if (_isNil(FastifyFormContainer)) {
    console.warn('FastifyFormContainer not registered');
    return null;
  }

  const fieldsRender = useMemo(() => {
    return props.fields.map((fieldMeta, i) => {
      const fieldName = fieldMeta.name;
      const Component = getField(fieldMeta.type);

      if (_isNil(Component)) {
        return null;
      } else {
        return (
          <Field name={fieldName} key={fieldName + i}>
            {({ field, meta }: FieldProps<any>) => (
              <Component
                key={fieldName + i + 'component'}
                {...fieldMeta}
                value={field.value}
                error={meta.error}
                onChange={(val: any) => {
                  setFieldValue(fieldName, val, false);
                  handleValuesChange({
                    ...formik.values,
                    [fieldName]: val,
                  });
                }}
                onBlur={(e: any) => {
                  field.onBlur(e);
                  formik.validateField(fieldName);
                }}
              />
            )}
          </Field>
        );
      }
    });
  }, [props.fields]);

  return (
    <FormikProvider value={formik}>
      <FastifyFormContainer
        loading={loading}
        layout={props.layout ?? 'horizontal'}
        submitLabel={props.submitLabel}
        handleSubmit={handleSubmit}
        canSubmit={_isEmpty(errors)}
        extraProps={props.extraProps}
      >
        {fieldsRender}
      </FastifyFormContainer>
    </FormikProvider>
  );
});
_FastifyForm.displayName = 'FastifyForm';

/**
 * 一个快速生成表单的组件
 * 用于通过配置来生成表单，简化通用代码
 */
export const FastifyForm = _FastifyForm as unknown as <
  T extends Record<string, any> = {},
  K extends Record<string, any> = {}
>(
  props: FastifyFormProps<T, K>
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
export type { FastifyFormInstance } from './context';
