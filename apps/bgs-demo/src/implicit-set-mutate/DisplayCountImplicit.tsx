import {store} from './store';
import {useStoreImplicit} from "./use-store-implicit";

export const DisplayCountImplicit = () => {
    const {value} = useStoreImplicit(store, (store) => store.counter);

    const setCounter = () => {
        store.counter += 1;
    }

    const dontRerender = () => {
        store.other += 1;
    }

    return <div>
        <button onClick={setCounter}>Add</button>
        <button onClick={dontRerender}>Test</button>
        <p>{value}</p>
    </div>
}
