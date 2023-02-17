import {
     describe,
    test,
    expect, vi
} from "vitest";
import {fireEvent, render} from "@testing-library/react";
import {createAtom} from "@producks/core";
import {useAtomMeta, useAtomSelector} from "./index";

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

    test('Should re-render multiple keys', () => {
        const atom = createAtom({
            count: 1,
            otherCount: 2
        })

        const Comp = () => {
            const count = useAtomSelector(atom, state => state.count);
            const otherCount = useAtomSelector(atom, state => state.otherCount);

            const addCount = () => {
                atom.count += 1;
            }

            const addOther = () => {
                atom.otherCount += 1;
            }

            return <>
                <button onClick={addCount}>AddCount</button>
                <button onClick={addOther}>AddOther</button>
                <p>Count: {count}</p>
                <p>Other: {otherCount}</p>
            </>
        }
        const {getByText} = render(<Comp/>)

        expect(getByText("Count: 1")).toBeInTheDocument();
        expect(getByText("Other: 2")).toBeInTheDocument();

        fireEvent.click(getByText("AddCount"));
        expect(getByText("Count: 2")).toBeInTheDocument();

        fireEvent.click(getByText("AddOther"));
        expect(getByText("Other: 3")).toBeInTheDocument();
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
