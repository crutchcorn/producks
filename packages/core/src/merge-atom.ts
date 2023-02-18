import {Atom, createAtom} from "./create-atom";

export const mergeAtoms = <R extends Record<string, Atom>>(atomRecord: R):
    {
      [key in keyof R]: R[key]['__object__']
    } extends infer T ? Atom<T> & T : never => {
    const accObject = {} as Record<string, any>;

    for (let [atomName, atom] of Object.entries(atomRecord)) {
        accObject[atomName] = atom.__object__;
    }

    const mergedAtom = createAtom(accObject);

    for (let [atomName, atom] of Object.entries(atomRecord)) {
        atom.__onChangeFnSettersChange__ = atom.__onChangeFnSettersChange__ ?? [];
        atom.__onChangeFnSettersChange__.push(() => {
            mergedAtom.__changeFnSetters__ = Object.values(atomRecord).reduce((prev, atom) => {
                return prev.concat(atom.__changeFnSetters__ ?? []);
            }, [] as Atom['__changeFnSetters__'])
        });
    }

    return mergedAtom as never;
}
