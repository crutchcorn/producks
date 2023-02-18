import { beforeEach, describe,
    test,
    expect, vi, } from "vitest";
import {mergeAtoms} from "./merge-atom";
import {createAtom} from "./create-atom";

describe('Merge atoms', () => {
    test("Should reflect internal values", () => {
        const mergedAtom = mergeAtoms({
            users: createAtom({
                users: [
                ]
            })
        })

        expect(mergedAtom.users.users).toEqual([]);
    })


    test("Should update change function from base atom", () => {
        const userAtom = createAtom({
            users: [
            ] as number[]
        });

        const mergedAtom = mergeAtoms({
            users: userAtom
        })

        const changeFn = vi.fn();
        userAtom.__changeFnSetters__ = [changeFn];

        mergedAtom.users.users = [1, 2, 3];

        expect(changeFn).toHaveBeenCalled();
    })
})
