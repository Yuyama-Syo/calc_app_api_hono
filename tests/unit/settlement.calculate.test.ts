// settlement.calculate.test.ts
import { describe, it, expect } from "vitest";
import { calculateSettlement } from "../../src/domain/settlement/calculate";
import { Expense } from "../../src/domain/expense/types";

describe("calculateSettlement", () => {
  it("2人, 1人が全額支払い → 1本のtransfer", () => {
    const expenses: Expense[] = [
      {
        expenseId: "e1",
        groupId: "g1",
        amount: 1000,
        payerId: "u1",
        participants: ["u1", "u2"],
      },
    ];
    const result = calculateSettlement(expenses, "equal");
    expect(result.transfers.length).toBe(1);
    expect(result.transfers[0]).toEqual({
      fromUserId: "u2",
      toUserId: "u1",
      amount: 500,
    });
    expect(result.meta.algorithm).toBe("equal");
  });

  it("複数人 → 複数transfer", () => {
    const expenses: Expense[] = [
      {
        expenseId: "e1",
        groupId: "g1",
        amount: 900,
        payerId: "u1",
        participants: ["u1", "u2", "u3"],
      },
      {
        expenseId: "e2",
        groupId: "g1",
        amount: 600,
        payerId: "u2",
        participants: ["u1", "u2", "u3"],
      },
    ];
    const result = calculateSettlement(expenses, "equal");
    expect(result.transfers.length).toBeGreaterThanOrEqual(2);
    expect(result.meta.algorithm).toBe("equal");
    // 合計ネットゼロ
    const sum = result.transfers.reduce((acc, t) => acc + t.amount, 0);
    expect(sum).toBeGreaterThan(0);
  });

  it("empty expenses → SETTLEMENT_NOT_READY", () => {
    expect(() => calculateSettlement([], "equal")).toThrow();
  });
});
