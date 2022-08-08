# react-fastify-form

元数据驱动的表单系统

基于 [formik](https://formik.org/)

## How to use

`react-fastify-form` 不是一个开箱即用的插件，因为它的每一种实现都需要开发者自己决定。因此它也能适配任意开发者想要的UI系统

### Defined meta types

```tsx
import React, { useEffect, useMemo } from 'react';
import {
  FastifyForm,
  regField,
  regFormContainer,
  FastifyFormContainerProps,
  useFastifyFormContext,
  FastifyFormInstance,
  FastifyFormProps,
} from 'react-fastify-form';
import { Form, Button, Input } from 'antd';
import type { FastifyFormFieldComponent } from 'react-fastify-form';

function getValidateStatus(
  error: string | undefined
): 'error' | 'success' {
  if (error === undefined || error === '') {
    return 'success';
  } else {
    return 'error';
  }
}

const FastifyFormText: FastifyFormFieldComponent = React.memo(
  (props) => {
    const { name, label, value, onChange, error, maxLength, placeholder } =
      props;

    return (
      <Form.Item
        label={label}
        validateStatus={getValidateStatus(error)}
        help={error}
      >
        <Input
          name={name}
          size="large"
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </Form.Item>
    );
  }
);
FastifyFormText.displayName = 'FastifyFormText';

regField('text', FastifyFormText);

const FastifyFormContainer: React.FC<
  FastifyFormContainerProps<FastifyFormContainerExtraProps>
> = React.memo((props) => {
  const layout = props.layout;

  const submitButtonRender = useMemo(() => {
    return (
      <Form.Item
        wrapperCol={
          layout === 'vertical'
            ? { xs: 24 }
            : { sm: 24, md: { span: 16, offset: 8 } }
        }
      >
        <Button
          loading={props.loading}
          type="primary"
          size="large"
          htmlType="button"
          style={{ width: '100%' }}
          onClick={() => props.handleSubmit()}
          disabled={props.canSubmit === false}
        >
          {props.submitLabel ?? 'Submit'}
        </Button>
      </Form.Item>
    );
  }, [
    props.loading,
    props.handleSubmit,
    props.canSubmit,
    props.submitLabel,
    layout,
  ]);

  return (
    <Form
      layout={layout}
      labelCol={layout === 'vertical' ? { xs: 24 } : { sm: 24, md: 8 }}
      wrapperCol={layout === 'vertical' ? { xs: 24 } : { sm: 24, md: 16 }}
    >
      {props.children}

      {submitButtonRender}
    </Form>
  );
});
FastifyFormContainer.displayName = 'FastifyFormContainer';
regFormContainer(FastifyFormContainer);

function FastifyForm()

export const MyFastifyForm = FastifyForm;
MyFastifyForm.displayName = 'MyFastifyForm';
```

### Use in components

```tsx
function Foo() {
  return <MyFastifyForm fields={[{type: 'text', name: 'name', label: 'Name'}]} />
}
```
