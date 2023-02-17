import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    plugins: [react(), dts({
        entryRoot: path.resolve(__dirname, "src")
    })],
    build: {
        lib: {
            entry: {
                'producks-react': path.resolve(__dirname, "src/index.ts"),
            },
            name: "BGSReact",
            fileName: (format, entryName) => `${entryName}-${format}.js`,
            formats: ["es", "cjs"],
        },
        rollupOptions: {
            external: [
                "react",
                "react-dom",
                "react/jsx-runtime",
                "@producks/core"
            ],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                    "@producks/core": "ProducksCore"
                },
            },
        },
    },
});
