import {useMemo, useReducer} from "react";
import {Atom} from "bgs";

export const useStoreImplicit = <T extends object>(storeObj: T & Atom<T>) => {
    const [_, rerender] = useReducer(s => !s, true);

    storeObj.__changeFnSetter__ = rerender;

    const storeRef = useMemo(() => ({current: storeObj.__object__}), [storeObj]);

    return [storeObj, storeRef] as const;
}
