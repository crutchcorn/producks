import {immutableProxifyDeep} from "./immutable-proxify-deep";

export interface Atom<T = any> {
    __changeFnSetters__: Array<(...args: any[]) => void>
    __onChangeFnSettersChange__: Array<(val: Array<(...args: any[]) => void>) => void>;
    __object__: T
}

export function createAtom<T extends object>(obj: T): T & Atom<T> {
    function changeFn(this: Atom<T>, ...args: any[]) {
        if (this.__changeFnSetters__) {
            this.__changeFnSetters__.forEach(fn => fn(...args));
        }
    }
    return immutableProxifyDeep(obj, changeFn.bind(obj as never)) as never;
}
