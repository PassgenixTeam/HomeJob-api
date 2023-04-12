import { existsSync, unlinkSync } from 'fs';
import * as _ from 'lodash';

export const removeKeyUndefined = (data: any) => {
  Object.keys(data).forEach((key) => {
    if (data[key] === undefined) {
      delete data[key];
    }
  });

  return data;
};

export const totalPagination = (total: number, limit: number): number => {
  return Math.ceil(total / limit);
};

export const randomNumber = () => {
  return `${new Date().getTime()}${Math.round(Math.random() * 1e6)}`;
};

export const deleteFiles = (paths: string[]) => {
  return new Promise((resolve, reject) => {
    paths.forEach((path) => {
      try {
        if (existsSync(path)) unlinkSync(path);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  });
};

/**
 * Find the differences between two arrays.
 *
 * @param {any[]} arr1 - The first array.
 * @param {any[]} arr2 - The second array.
 * @returns {{ list1Only: any[], list2Only: any[], common: any[] }} An object containing the following keys:
 * - `list1Only`: An array of elements that are only in `arr1`.
 * - `list2Only`: An array of elements that are only in `arr2`.
 * - `common`: An array of elements that appear in both `arr1` and `arr2`.
 *
 * @example
 * const arr1 = [1, 2, 3, 4];
 * const arr2 = [2, 3, 5];
 * const result = differenceMultiArray(arr1, arr2);
 * // result: { list1Only: [1, 4], list2Only: [5], common: [2, 3] }
 */
export const differenceMultiArray = (
  arr1: any[],
  arr2: any[],
): { list1Only: any[]; list2Only: any[]; common: any[] } => {
  return {
    list1Only: _.differenceWith(arr1, arr2, _.isEqual),
    list2Only: _.differenceWith(arr2, arr1, _.isEqual),
    common: _.intersectionWith(arr1, arr2, _.isEqual),
  };
};

/**
 * Checks if a string is a valid JSON object.
 * @param str The string to check.
 * @returns True if the string is a valid JSON object, otherwise false.
 * @example
 * isJson('{"name": "John", "age": 30}') // true
 * isJson('{"name": "John", "age": }') // false
 */
export const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};
