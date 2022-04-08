import {store as storeImport} from './store';
import {useStoreImplicit} from "./use-store-implicit";

export const DisplayCountImplicit = () => {
    const [store, storeRef] = useStoreImplicit(storeImport);

    const setCounter = () => {
        store.counter += 1;
    }

    const setCounterRef = () => {
        storeRef.current.counter += 1;
    }

    return <div>
        <button onClick={setCounter}>Add</button>
        <button onClick={setCounterRef}>Add Ref</button>
        <p>{store.counter}</p>
    </div>
}
