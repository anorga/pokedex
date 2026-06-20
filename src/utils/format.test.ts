import { describe, expect, it } from "vitest";
import { capitalize } from "./format";

describe("capitalize", () => {
  it("uppercases the first letter", () => {
    expect(capitalize("pikachu")).toBe("Pikachu");
  });

  it("leaves an empty string untouched", () => {
    expect(capitalize("")).toBe("");
  });
});
