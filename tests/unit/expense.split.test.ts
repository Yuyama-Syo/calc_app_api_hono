// expense.split.test.ts
import { describe, it, expect } from "vitest";
import { splitExpense } from "../../src/domain/expense/split";

describe("splitExpense", () => {
  it("均等分割（端数なし）", () => {
    const shares = splitExpense(1000, ["a", "b", "c"]);
    expect(shares.map(s => s.amount)).toEqual([333, 333, 334]);
    expect(shares.reduce((acc, s) => acc + s.amount, 0)).toBe(1000);
  });

  it("均等分割（端数あり）", () => {
    const shares = splitExpense(1001, ["a", "b", "c"]);
    expect(shares.map(s => s.amount)).toEqual([333, 333, 335]);
    expect(shares.reduce((acc, s) => acc + s.amount, 0)).toBe(1001);
  });

  it("participants空はエラー", () => {
    expect(() => splitExpense(1000, [])).toThrow();
  });

  it("amount 0はエラー", () => {
    expect(() => splitExpense(0, ["a"])).toThrow();
  });

  it("amount 小数はエラー", () => {
    expect(() => splitExpense(100.5, ["a", "b"])).toThrow();
  });
});
