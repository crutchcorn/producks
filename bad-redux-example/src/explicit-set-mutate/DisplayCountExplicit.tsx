import {store as storeImport} from './store';
import {useStoreExplicit} from "./use-store-explicit";

export const DisplayCountExplicit = () => {
    const [store, mutateStore] = useStoreExplicit(storeImport);

    const setCounter = () => {
        mutateStore((localStore) => {
            localStore.counter += 1;
        })
    }

    return <div>
        <button onClick={setCounter}>Add</button>
        <p>{store.counter}</p>
    </div>
}
