import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { debounce } from "./debounce";

describe("debounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("invokes fn after delay", () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 300);
    debounced("x");
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(300);
    expect(fn).toHaveBeenCalledWith("x");
  });
});
