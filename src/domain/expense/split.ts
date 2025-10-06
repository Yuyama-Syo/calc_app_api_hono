// split.ts
import { ExpenseShare } from "./types";

/**
 * participants: UUID[]
 * amount: 整数cents
 * mode: "equal"（将来拡張用）
 * 
 * sum(shares.amount) === totalAmount を保証
 * 端数は最後の要素に調整
 */
export function splitExpense(
  totalAmount: number,
  participants: string[],
  mode: "equal" = "equal"
): ExpenseShare[] {
  if (participants.length === 0) throw new Error("participantsは空不可");
  if (totalAmount <= 0 || !Number.isInteger(totalAmount)) throw new Error("amountは正の整数cents");

  const base = Math.floor(totalAmount / participants.length);
  const remainder = totalAmount - base * participants.length;
  const shares: ExpenseShare[] = participants.map((userId, i) => ({
    userId,
    amount: base + (i === participants.length - 1 ? remainder : 0),
  }));
  // sumチェック
  const sum = shares.reduce((acc, s) => acc + s.amount, 0);
  if (sum !== totalAmount) throw new Error("分割合計不整合");
  return shares;
}
