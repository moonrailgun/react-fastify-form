import { FormikContextType, useFormikContext } from 'formik';

export type FastifyFormInstance = FormikContextType<{}>;

export function useFastifyFormContext<Values>(): FormikContextType<Values> {
  return useFormikContext();
}
