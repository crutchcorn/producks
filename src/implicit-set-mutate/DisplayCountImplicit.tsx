import {store as storeImport} from './store';
import {useStoreImplicit} from "./use-store-implicit";

export const DisplayCountImplicit = () => {
    const [store, storeRef] = useStoreImplicit(storeImport);

    const setCounter = () => {
        store.counter += 1;
        storeRef.current.counter += 1;
    }

    return <div>
        <button onClick={setCounter}>Add</button>
        <p>{store.counter}</p>
    </div>
}
