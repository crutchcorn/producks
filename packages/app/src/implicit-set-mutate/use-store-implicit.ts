import {useMemo, useReducer} from "react";
import {immutableProxifyDeep} from "bad-redux";

export const useStoreImplicit = <T extends object>(storeObj: T) => {
    const [_, rerender] = useReducer(s => !s, true);

    const storeObjMutable = useMemo(() =>
        immutableProxifyDeep(storeObj, rerender), [storeObj]
    );

    const storeRef = useMemo(() => ({
        current: storeObj
    }), [storeObj]);

    return [storeObjMutable, storeRef] as const;
}
