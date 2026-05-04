import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
		tailwindcss(),
	],
	test: {
		environment: "jsdom",
		globals: true,
		setupFiles: ["./src/test/setup.js"],
		css: false,
		coverage: {
			provider: "v8",
			reporter: ["text", "lcov", "json-summary"],
			include: ["src/components/**", "src/context/**", "src/api/**", "src/utils/**"],
		},
	},
});
