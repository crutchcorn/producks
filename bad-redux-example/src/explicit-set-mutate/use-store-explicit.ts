import {useState} from "react";

export const useStoreExplicit = <T>(storeObj: T) => {
    const [_, setR] = useState(true);

    const rerender = () => setR(b => !b);

    const mutateStore = (mutateCb: (obj: T) => void) => {
        mutateCb(storeObj)
        rerender();
    }

    return [storeObj, mutateStore] as const;
}
