import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            entry: {
                'producks-core': path.resolve(__dirname, "src/index.ts"),
            },
            name: "ProducksCore",
            fileName: (format, entryName) => `${entryName}-${format}.js`,
            formats: ["es", "cjs"],
        },
    },
});
