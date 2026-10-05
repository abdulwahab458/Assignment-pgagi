import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { screen } from "@testing-library/dom";
import { Provider } from "react-redux";
import { FavoritesSection } from "./FavoritesSection";
import { makeStore } from "@/store/store";

describe("FavoritesSection", () => {
  it("shows empty state when no favorites", () => {
    const store = makeStore();
    render(
      <Provider store={store}>
        <FavoritesSection />
      </Provider>,
    );
    expect(screen.getByText(/No favorites yet/i)).toBeInTheDocument();
  });
});
