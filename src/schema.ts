/* eslint-disable id-blacklist */
import { string, object, ref } from 'yup';
import type { ObjectShape } from 'yup/lib/object';

/**
 * 创建FastifyForm的Schema
 *
 *
 */
export function createFastifyFormSchema(fieldMap: ObjectShape) {
  return object().shape(fieldMap);
}

export const fieldSchema = {
  string,
  ref,
};
