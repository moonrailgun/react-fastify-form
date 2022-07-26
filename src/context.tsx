import React, { useContext } from 'react';
import type { useFormik } from 'formik';

type FastifyFormContextType = ReturnType<typeof useFormik>;

export const FastifyFormContext = React.createContext<FastifyFormContextType | null>(
  null
);
FastifyFormContext.displayName = 'FastifyFormContext';

export function useFastifyFormContext(): FastifyFormContextType | null {
  return useContext(FastifyFormContext);
}
