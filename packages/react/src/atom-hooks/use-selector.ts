import {useReducer, useRef} from "react";
import {Atom} from "@producks/core";
import useIsomorphicLayoutEffect from "../utils/use-isomorphic-layout-effect";

export const useAtomSelector = <T extends object, R>(storeObj: T & Atom<T>, selector: (store: T) => R) => {
    const [_, rerender] = useReducer(() => ({}), {});

    const prevValue = useRef<R>(selector(storeObj));

    useIsomorphicLayoutEffect(() => {
        const changeFnSetter = () => {
            const newVal = selector(storeObj);
            if (newVal === prevValue.current) return;
            prevValue.current = newVal;
            rerender();
        };

        storeObj.__changeFnSetters__ = storeObj.__changeFnSetters__ ?? [];

        storeObj.__changeFnSetters__.push(changeFnSetter);

        return () => {
            storeObj.__changeFnSetters__.splice(storeObj.__changeFnSetters__.indexOf(changeFnSetter), 1);
        }
    }, [selector, storeObj]);

    return prevValue.current;
}
