import React, { useContext } from 'react';
import type { useFormik } from 'formik';

export type FastifyFormInstance = ReturnType<typeof useFormik>;

export const FastifyFormContext =
  React.createContext<FastifyFormInstance | null>(null);
FastifyFormContext.displayName = 'FastifyFormContext';

export function useFastifyFormContext(): FastifyFormInstance | null {
  return useContext(FastifyFormContext);
}
