import {Atom, createAtom} from "./create-atom";

export const mergeAtoms = <R extends Record<string, Atom>>(atomRecord: R):
    {
      [key in keyof R]: R[key]['__object__']
    } extends infer T ? Atom<T> & T : never => {
    const accObject = {} as Record<string, any>;
    for (let [atomName, atom] of Object.entries(atomRecord)) {
        accObject[atomName] = atom.__object__;
    }

    const ___changeFnSetters__ = {current: [] as Atom['__changeFnSetters__']};

    Object.assign(accObject, {
        set __changeFnSetters__(changeFnSetters) {
            ___changeFnSetters__.current = changeFnSetters;
        },
        get __changeFnSetters__() {
            console.log({u: atomRecord['users']})
            let changeFns = [] as Atom['__changeFnSetters__'];
            for (let atom of Object.values(atomRecord)) {
                changeFns = changeFns.concat(atom.__changeFnSetters__ ?? []);
            }
            return changeFns.concat(___changeFnSetters__.current);
        }
    })

    const atom = createAtom(accObject);

    return atom as any;
}
