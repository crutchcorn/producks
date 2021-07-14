type SimpleRecord = Record<string | symbol | number, any>;

function promisifyAndMutate(objToProxy: SimpleRecord, originalObj: SimpleRecord, accObj: SimpleRecord) {
    return new Proxy(objToProxy, {
        get: function (object, name: string) {
            if (name == '__proxy__') {
                return true;
            }
            return object[name];
        },
        set: function (object, name: string, value) {
            if (value && typeof value == 'object') {
                // Promisify the value deeply, assign to `acc[key][name]`
                accObj[name] = immutableProxifyDeep(value);
            }

            // Mutate the original object reference, without promisifying (even for objects)
            originalObj[name] = value;

            // TODO: Run change fn

            // Change worked successfully
            return true;
        }
    })
}

function immutableProxifyDeep<T extends object>(obj: T): T {
    let acc = {} as any;
    for (let [key, val] of Object.entries(obj)) {
        if (typeof val === 'object') {
            const constructedObj = immutableProxifyDeep(val);
            const proxyObj = promisifyAndMutate(constructedObj, val, acc[key]);
            acc[key] = proxyObj;
            continue;
        }

        acc[key] = val;
    }

    return promisifyAndMutate(acc, obj, acc);
}
