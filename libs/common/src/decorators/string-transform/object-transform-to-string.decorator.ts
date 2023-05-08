import { Transform, TransformOptions } from 'class-transformer';
import { isArray, isJSON, isObject } from 'class-validator';

/**
 * A transformation function that converts an object to a JSON string.
 * @returns A transformer function used to convert an object to a JSON string.
 * @example
 * const transformStr = ObjectTransformString();
 * const plainObj = transformStr.transform({ value: { name: "John", age: 30 } });
 * console.log(plainObj); // '{"name": "John", "age": 30}'
 */
export const ObjectTransformToString = (option?: TransformOptions) =>
  Transform(
    ({ value }) => {
      if (
        typeof value === 'object' &&
        (isJSON(value) || isArray(value) || isObject(value))
      )
        return JSON.stringify(value);
    },
    {
      toClassOnly: true,
      ...option,
    },
  );
