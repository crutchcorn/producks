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
            const thisObj = getAccObj();
            if (thisObj[name] !== originalObj[name]) {
                const originalValue = originalObj[name];

                if (originalValue && typeof originalValue == 'object') {
                    const proxyVal = immutableProxifyDeep(originalValue);
                    Reflect.set(thisObj, name, proxyVal);
                } else {
                    Reflect.set(thisObj, name, originalValue);
                }
            }

            return object[name];
        },
        set: function (object, name: string, value) {
            const oldVal = object[name];
            const accObj = getAccObj();

            if (value && typeof value == 'object') {
                // Promisify the value deeply, assign to `acc[key][name]`
                Reflect.set(accObj, name, immutableProxifyDeep(value));
            } else {
                Reflect.set(accObj, name, value);
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
