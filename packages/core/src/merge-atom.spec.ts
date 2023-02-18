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

        console.log("1")
        const changeFn = vi.fn();
        console.log("2")
        userAtom.__changeFnSetters__ = [changeFn];

        console.log("3")
        mergedAtom.users.users = [1, 2, 3];

        console.log("4")
        expect(changeFn).toHaveBeenCalled();
    })
})
