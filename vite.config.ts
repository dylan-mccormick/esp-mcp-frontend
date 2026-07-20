import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    base: "https://registry-api.mnmzc.us.to/r/7/api/v1/public/frontend/",
    plugins: [react(), tailwindcss()]
});
