// calculate.ts
import { Expense } from "../expense/types";

export type SettlementTransfer = {
  fromUserId: string;
  toUserId: string;
  amount: number; // cents
};

export type SettlementResult = {
  transfers: SettlementTransfer[];
  meta: { algorithm: string };
};

/**
 * expenses: Expense[]
 * algorithm: 'equal'（現状equalのみ/TODO: weighted）
 * 
 * Σ(positive transfers.amount) == Σ(negative)（絶対値）/ 合計ネットゼロ
 */
export function calculateSettlement(
  expenses: Expense[],
  algorithm: "equal" = "equal"
): SettlementResult {
  if (expenses.length === 0) throw new Error("SETTLEMENT_NOT_READY");

  // 参加者一覧
  const userSet = new Set<string>();
  expenses.forEach(e => e.participants.forEach(u => userSet.add(u)));
  const users = Array.from(userSet);

  // 各ユーザーの支払額・負担額
  const paid: Record<string, number> = {};
  const owed: Record<string, number> = {};
  users.forEach(u => { paid[u] = 0; owed[u] = 0; });

  expenses.forEach(e => {
    paid[e.payerId] += e.amount;
    const share = Math.floor(e.amount / e.participants.length);
    const remainder = e.amount - share * e.participants.length;
    e.participants.forEach((u, i) => {
      owed[u] += share + (i === e.participants.length - 1 ? remainder : 0);
    });
  });

  // ネット残高
  const net: Record<string, number> = {};
  users.forEach(u => { net[u] = paid[u] - owed[u]; });

  // transfer計算（cycle短縮は簡易実装）
  const creditors = users.filter(u => net[u] > 0).sort((a, b) => net[b] - net[a]);
  const debtors = users.filter(u => net[u] < 0).sort((a, b) => net[a] - net[b]);
  const transfers: SettlementTransfer[] = [];

  let ci = 0, di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const creditor = creditors[ci];
    const debtor = debtors[di];
    const amount = Math.min(net[creditor], -net[debtor]);
    if (amount > 0) {
      transfers.push({ fromUserId: debtor, toUserId: creditor, amount });
      net[creditor] -= amount;
      net[debtor] += amount;
    }
    if (net[creditor] === 0) ci++;
    if (net[debtor] === 0) di++;
  }

  // Invariant: 合計ネットゼロ
  const totalPositive = transfers.reduce((acc, t) => acc + t.amount, 0);
  const totalNegative = transfers.reduce((acc, t) => acc - t.amount, 0);
  if (totalPositive + totalNegative !== 0) throw new Error("ネットゼロ不整合");

  return { transfers, meta: { algorithm } };
}
