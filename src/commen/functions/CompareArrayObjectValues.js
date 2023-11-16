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
