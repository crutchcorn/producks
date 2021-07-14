import {useState} from "react";
import {store} from './store';

export const DisplayCountExplicit = () => {
    const [_, setR] = useState(true);

    const rerender = () => setR(b => !b);

    const setCounter = () => {
        store.counter += 1;
        rerender();
    }

    return <div>
        <button onClick={setCounter}>Add</button>
        <p>{store.counter}</p>
    </div>
}
