type SimpleRecord = Record<string | symbol | number, any>;

type ChangeFn = (object: any, name: string | symbol | number, oldVal: any, value: any) => void;

/**
 *
 * @param objToProxy
 * @param originalObj
 * @param getAccObj - Is a function in order to support both `acc[key][name]` and `acc[name]` alike
 * @param changeFn
 */
function promisifyAndMutate(
    objToProxy: SimpleRecord,
    originalObj: SimpleRecord,
    getAccObj: () => SimpleRecord,
    changeFn: ChangeFn
) {
    return new Proxy(objToProxy, {
        get: function (object, name: string) {
            if (name == '__proxy__') {
                return true;
            }
            // Add a hidden method used to mutate object, therefore bypassing the "set" trap
            if (name == '__mutateState__') {
                return (_: never, key: string, value: any) => {
                    object[key] = value
                }
            }
            return object[name];
        },
        set: function (object, name: string, value) {
            const oldVal = object[name];
            const accObj = getAccObj();

            const setterFn = accObj['__mutateState__'] ?? Reflect.set;

            if (value && typeof value == 'object') {
                // Promisify the value deeply, assign to `acc[key][name]`
                setterFn(getAccObj(), name, immutableProxifyDeep(value));
            } else {
                setterFn(getAccObj(), name, value);
            }

            // Mutate the original object reference, without promisifying (even for objects)
            originalObj[name] = value;

            // Notify listeners of changes
            changeFn(object, name, oldVal, value);

            // Change worked successfully
            return true;
        }
    })
}

export function immutableProxifyDeep<T extends object>(obj: T, changeFn: ChangeFn = () => {}): T {
    let acc = {} as any;
    for (let [key, val] of Object.entries(obj)) {
        if (typeof val === 'object') {
            const constructedObj = immutableProxifyDeep(val);
            const proxyObj = promisifyAndMutate(constructedObj, val, () => acc[key], changeFn);
            acc[key] = proxyObj;
            continue;
        }

        acc[key] = val;
    }

    return promisifyAndMutate(acc, obj, () => acc, changeFn);
}
