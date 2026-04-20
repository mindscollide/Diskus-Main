/**
 * @file CompareArrayObjectValues.js
 * @description Utilities for deep structural comparison of objects and for
 * validating that every property inside an array of objects has a non-empty value.
 */

/**
 * Performs a deep structural equality check between two values.
 * Primitives are compared with `===`; objects are compared recursively by
 * key count and value. Returns `false` for `null` inputs of "object" type.
 * @param {*} obj1
 * @param {*} obj2
 * @returns {boolean} `true` when both values are structurally identical.
 */
export const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) {
    return true;
  }

  if (
    typeof obj1 !== "object" ||
    obj1 === null ||
    typeof obj2 !== "object" ||
    obj2 === null
  ) {
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
      return false;
    }
  }

  return true;
};

/**
 * Checks that every own-property in every object inside an array has a
 * non-empty value (i.e. not `undefined`, `null`, or `""`).
 * @param {Array<Object>} arrayOfObjects
 * @returns {boolean} `true` only when all values in all objects are non-empty.
 */
export const areAllValuesNotEmpty = (arrayOfObjects) => {
  for (let i = 0; i < arrayOfObjects.length; i++) {
    const currentObject = arrayOfObjects[i];

    // Iterate through the values in the current object
    for (const key in currentObject) {
      if (currentObject.hasOwnProperty(key)) {
        // Check if the value is empty (undefined, null, or an empty string)
        if (
          currentObject[key] === undefined ||
          currentObject[key] === null ||
          currentObject[key] === ""
        ) {
          return false; // If any value is empty, return false
        }
      }
    }
  }

  // If all values are not empty in all objects, return true
  return true;
};
