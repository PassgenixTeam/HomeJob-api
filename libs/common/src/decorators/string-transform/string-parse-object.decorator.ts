import { Transform } from 'class-transformer';
import { isJSON } from 'class-validator';

/**
 * A class representing a string transformation object.
 * @example
 * const transformObj = StringTransformObject();
 * const plainObj = transformObj.transform({ value: '{"name": "John", "age": 30}' });
 * console.log(plainObj); // { name: "John", age: 30 }
 */
export const StringTransformObject = () =>
  Transform(
    ({ value }) => {
      if (typeof value === 'string' && isJSON(value)) return JSON.parse(value);
    },
    {
      toPlainOnly: true,
    },
  );
