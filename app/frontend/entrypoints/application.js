// app/frontend/entrypoints/application.js

import "@mantine/core/styles.css";
import { createInertiaApp } from "@inertiajs/react";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
  components: {
    Badge: {
      styles: {
        root: { textTransform: "capitalize" },
      },
    },
  },
});

createInertiaApp({
  title: (title) => title ? `${title} — Neo Kizomba Festival` : 'Neo Kizomba Festival',
  resolve: (name) => {
    const pages = import.meta.glob("../pages/**/*.tsx", { eager: true });
    return pages[`../pages/${name}.tsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      createElement(MantineProvider, { theme }, createElement(App, props))
    );
  },
});
