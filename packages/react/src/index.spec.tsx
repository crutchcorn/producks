import {
     describe,
    test,
    expect, vi
} from "vitest";
import {fireEvent, render} from "@testing-library/react";
import {createAtom} from "@producks/core";
import {useAtomMeta} from "./use-atom-meta";

describe('Use atom meta', () => {
    test('Should be able to mutate a store without re-rendering', () => {
        const atom = createAtom({
            count: 1
        })

        const compRender = vi.fn();

        const Comp = () => {
            compRender();

            const {atomRef} = useAtomMeta(atom);

            const onClick = () => {
                atomRef.current.count += 1;
            }

            return <>
                <button onClick={onClick}>Mutate</button>
                <p>{atom.count}</p>
            </>
        }
        const {getByText} = render(<Comp/>)

        expect(compRender).toBeCalledTimes(1);
        expect(getByText("1")).toBeInTheDocument();

        fireEvent.click(getByText("Mutate"));

        expect(compRender).toBeCalledTimes(1);
        expect(getByText("1")).toBeInTheDocument();
    });
});
