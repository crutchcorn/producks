import {store} from './store';
import {useAtomSelector} from "./use-selector";
import {useAtomMeta} from "./use-atom-meta";

export const DisplayCount = () => {
    const count = useAtomSelector(store, (store) => store.counter);
    const meta = useAtomMeta(store);

    const setCounter = () => {
        store.counter += 1;
    }

    const dontRerender = () => {
        store.other += 1;
        meta.atomRef.current.other = 2;
    }

    return <div>
        <button onClick={setCounter}>Add</button>
        <button onClick={dontRerender}>Test</button>
        <p>{count}</p>
    </div>
}
