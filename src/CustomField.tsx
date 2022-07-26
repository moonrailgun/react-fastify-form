import React from 'react';
import type { FastifyFormFieldComponent, FastifyFormFieldProps } from './field';

export const CustomField: FastifyFormFieldComponent<{
  render: (props: FastifyFormFieldProps) => React.ReactNode;
}> = React.memo((props) => {
  const { render, ...others } = props;

  return <>{render(others)}</>;
});
CustomField.displayName = 'CustomField';
