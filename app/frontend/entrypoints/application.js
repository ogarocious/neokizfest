// app/frontend/entrypoints/application.js

import "@mantine/core/styles.css";
import { createInertiaApp } from "@inertiajs/react";
import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob("../pages/**/*.tsx", { eager: true });
    return pages[`../pages/${name}.tsx`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      createElement(MantineProvider, {}, createElement(App, props))
    );
  },
});
