import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [dts()],
    build: {
        lib: {
            entry: {
                'bgs': path.resolve(__dirname, "src/index.ts"),
            },
            name: "BGS",
            fileName: (format, entryName) => `${entryName}-${format}.js`,
            formats: ["es", "cjs"],
        },
    },
});
