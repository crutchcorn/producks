import {useMemo, useReducer, useRef} from "react";
import {Atom} from "bgs";

export const useStoreImplicit = <T extends object, R>(storeObj: T & Atom<T>, selector: (store: T) => R) => {
    const [_, rerender] = useReducer(() => ({}), {});

    const prevValue = useRef<R>(selector(storeObj));
    storeObj.__changeFnSetter__ = (obj: T) => {
        const newVal = selector(obj);
        if (newVal === prevValue.current) return;
        prevValue.current = newVal;
        rerender();
    };

    const storeRef = useMemo(() => ({current: storeObj.__object__}), [storeObj]);

    return {
        value: prevValue.current,
        store: storeObj,
        storeRef
    } as const;
}
