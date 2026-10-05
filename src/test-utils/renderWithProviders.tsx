import { render, type RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { makeStore, type AppStore } from "@/store/store";

export function renderWithProviders(
  ui: React.ReactElement,
  {
    store = makeStore(),
    ...options
  }: { store?: AppStore } & Omit<RenderOptions, "wrapper"> = {},
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...options }) };
}
