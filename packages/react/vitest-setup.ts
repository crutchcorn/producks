// vitest-setup.ts
import { expect, afterEach } from 'vitest';
import matchers, {
    TestingLibraryMatchers,
} from '@testing-library/jest-dom/matchers';

import { cleanup } from '@testing-library/react';

expect.extend(matchers);

afterEach(() => {
    cleanup();
});

declare global {
    namespace Vi {
        interface JestAssertion<T = any>
            extends jest.Matchers<void, T>,
                TestingLibraryMatchers<T, void> {}
    }
}
