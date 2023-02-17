import {useMemo} from "react";
import {Atom} from "bgs";

export const useAtomMeta = <T extends object, R>(atom: T & Atom<T>) => {
    const atomRef = useMemo(() => ({current: atom.__object__}), [atom]);

    return {
        atomRef,
        atom
    }
}
