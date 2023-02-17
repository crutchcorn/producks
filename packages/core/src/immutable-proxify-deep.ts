type SimpleRecord = Record<string | symbol | number, any>;

type ChangeFn = (object: any, name: string | symbol | number, oldVal: any, value: any) => void;

/**
 * Given an object and an original object, mutate them deeply and run the `changeFn` when anything is `set`
 *
 * This proxy allows for three special keys to be set/got:
 * - `__proxy__`: A `true` to tell you that it is a proxy object.
 * - `__changeFnSetters__`: A collection of function setter that is untouched when set in order to allow for atomic usage of changeFn.
 * - `__object__`: The original object that you can mutate without triggering `changeFn`
 * @param objToProxy
 * @param originalObj
 * @param changeFn
 */
function createMutableProxy(
    objToProxy: SimpleRecord,
    originalObj: SimpleRecord,
    changeFn: ChangeFn
) {
    return new Proxy(objToProxy, {
        get: function (object, name: string) {
            // Added prop to verify we're not promisifying the base object
            if (name === "__proxy__") {
                return true;
            }
            if (name === "__object__") {
                return originalObj;
            }
            if (object[name] !== originalObj[name]) {
              const originalValue = originalObj[name];

              const proxyVal = immutableProxifyDeep(originalValue, changeFn);
              Reflect.set(object, name, proxyVal);
            }

            return object[name];
        },
        set: function (object, name: string, value) {
            if (name === "__changeFnSetters__") {
                originalObj[name] = value;
                return true;
            }
            const oldVal = object[name];

            // If an property is being mutated/created as an object, we need to proxy it as well
            // proxify the value deeply, assign to `acc[key][name]`
            Reflect.set(object, name, immutableProxifyDeep(value, changeFn));

            // Mutate the original object reference, without proxifying (even for objects)
            originalObj[name] = value;

            // Notify listeners of changes
            changeFn(object, name, oldVal, value);

            // Change worked successfully
            return true;
        }
    })
}

/**
 * Wrapper logic to handle arrays, objects, and primitives
 * @param obj
 * @param changeFn
 */
export function immutableProxifyDeep<T extends object>(obj: T, changeFn: ChangeFn = () => {}): T {
  if (!(obj instanceof Object) || obj instanceof Function) {
    return obj;
  }

  // Hoist bound
  let bound: any;
  // Get prototype of the Functions, Arrays, and Objects
  const prototype = Object.getPrototypeOf(obj);

  if (Array.isArray(obj)) {
    // Create bound array
    // Run immutableProxifyDeep over array if isArray ([1, 2, 3] but not {"0": 1, "1": 2, "2": 3, "Symbol.species": Array})
    // Add the array's indexed own properties, all others will be re-added as if it was an object
    // - Use standard for loop over using Array.prototype.map or iterator in case the prototype was overridden
    bound = [];

    for (let index = 0; index < obj.length; index++) {
      bound[index] = immutableProxifyDeep(obj[index]);
    }

    // Change array prototype if needed
    // Object.setPrototypeOf is less preferred than Object.create but if the prototype was changed, it should be re-added after being made an array over an strict object
    if (prototype !== Array.prototype) {
      Object.setPrototypeOf(bound, prototype);
    }
  }

  // Proxify object (including function and array properties)
  // Create bound object using the original prototype
  // - Functions retain their prototype (modified or not) when bound
  if (typeof bound === "undefined") {
    bound = Object.create(prototype);
  }

  // Add own enumerable properties to bound object (shortcut for for-in-ownprop loop)
  for (const key of Object.keys(obj)) {
    // Skip existing own properties (i.e. when binding an array)
    if (Object.prototype.hasOwnProperty.call(bound, key)) {
      continue;
    }

    const descriptor = Object.getOwnPropertyDescriptor(obj, key)!;
    // Proxify the value
    if (!descriptor.set && !descriptor.get) {
        descriptor.value = immutableProxifyDeep(descriptor.value, changeFn);
    }
    // Add property to bound object
    Object.defineProperty(bound, key, descriptor as any);
  }

  return createMutableProxy(bound, obj, changeFn);
}
