    export function deepEqual(obj1: Record<string, any>, obj2: Record<string, any>) {
      if (obj1 === obj2) return true; // Handles primitive values and same object references

      if (typeof obj1 !== 'object' || obj1 === null ||
          typeof obj2 !== 'object' || obj2 === null) {
        return false; // Not both objects, or one is null
      }

      const keys1 = Object.keys(obj1);
      const keys2 = Object.keys(obj2);

      if (keys1.length !== keys2.length) return false; // Different number of properties

      for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
          return false; // Key missing or values not deeply equal
        }
      }
      return true;
    }

