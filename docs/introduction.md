# Introduction

> These docs are very WIP. Please check back in the future for more docs.

This is an example of what Producks looks like in React:

```tsx
import {useAtomSelector, useAtomMeta} from "@producks/react";
import {createAtom} from "@producks/core";

export const store = createAtom({
  counter: 0,
  other: 1
});

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
```
