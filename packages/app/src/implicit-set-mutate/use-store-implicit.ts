import {useMemo, useState} from "react";
import {immutableProxifyDeep} from "bad-redux";

export const useStoreImplicit = <T extends object>(storeObj: T) => {
    const [_, setR] = useState(true);

    const rerender = () => setR(b => !b);

    const storeObjMutable = useMemo(() =>
        immutableProxifyDeep(storeObj, rerender), [storeObj]
    );

    const storeRef = useMemo(() => ({
        current: storeObj
    }), [storeObj]);

    return [storeObjMutable, storeRef] as const;
}
