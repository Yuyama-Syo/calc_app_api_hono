// settlement.service.ts
import { ExpenseRepository } from "../repositories/expense.repository";
import { calculateSettlement, SettlementResult } from "../domain/settlement/calculate";
import { DomainError } from "../domain/errors";

export class SettlementService {
  private expenseRepo: ExpenseRepository;

  constructor(expenseRepo?: ExpenseRepository) {
    this.expenseRepo = expenseRepo ?? new ExpenseRepository();
  }

  calculate(groupId: string, algorithm: "equal" = "equal"): SettlementResult {
    const expenses = this.expenseRepo.findAllByGroupId(groupId);
    if (!expenses) throw new DomainError("GROUP_NOT_FOUND", "グループが見つかりません");
    if (expenses.length === 0) throw new DomainError("SETTLEMENT_NOT_READY", "精算可能な費用がありません");
    try {
      return calculateSettlement(expenses, algorithm);
    } catch (e: any) {
      if (e.message === "SETTLEMENT_NOT_READY") {
        throw new DomainError("SETTLEMENT_NOT_READY", "精算可能な費用がありません");
      }
      throw new DomainError("VALIDATION_ERROR", e.message);
    }
  }
}
