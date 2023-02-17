import {
     describe,
    test,
    expect, vi
} from "vitest";
import {fireEvent, render} from "@testing-library/react";
import {createAtom} from "@producks/core";
import {useAtomMeta} from "./use-atom-meta";
import {useAtomSelector} from "./use-selector";

describe('Use selector meta', () => {
    test('Should not re-render when non-selected data changes', () => {
        const atom = createAtom({
            count: 1,
            other: 2
        })

        const compRender = vi.fn();

        const Comp = () => {
            compRender();

            const count = useAtomSelector(atom, state => state.count);

            const onClick = () => {
                atom.other += 1;
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

    test('Should not re-render when selected data changes', () => {
        const atom = createAtom({
            count: 1,
            other: 2
        })

        const compRender = vi.fn();

        const Comp = () => {
            compRender();

            const count = useAtomSelector(atom, state => state.count);

            const onClick = () => {
                atom.count += 1;
            }

            return <>
                <button onClick={onClick}>Mutate</button>
                <p>{count}</p>
            </>
        }
        const {getByText} = render(<Comp/>)

        expect(compRender).toBeCalledTimes(1);
        expect(getByText("1")).toBeInTheDocument();

        fireEvent.click(getByText("Mutate"));

        expect(compRender).toBeCalledTimes(2);
        expect(getByText("2")).toBeInTheDocument();
    });
});

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
