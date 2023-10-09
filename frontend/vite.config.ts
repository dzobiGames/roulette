import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});

// // vite.config.js
// export default {
//   server: {
//     host: "192.168.100.107", // Specify your IP address
//     port: 5173, // Specify your desired port
//   },
//   // ... other Vite configuration options
// };
