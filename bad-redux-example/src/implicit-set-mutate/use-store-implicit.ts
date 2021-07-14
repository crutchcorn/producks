import {useMemo, useState} from "react";
import {immutableProxifyDeep} from "../utils/immutable-proxify-deep";

export const useStoreImplicit = <T extends object>(storeObj: T) => {
    const [_, setR] = useState(true);

    const rerender = () => setR(b => !b);

    const storeObjMutable = useMemo(() => immutableProxifyDeep(storeObj, rerender), [storeObj]);

    return [storeObjMutable] as const;
}
