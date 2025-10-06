// expense.repository.ts
import { Expense } from "../domain/expense/types";
import {
  Entity,
  PrimaryColumn,
  Column,
  DataSource,
  Repository,
} from "typeorm";

@Entity({ name: "expenses" })
export class ExpenseEntity {
  @PrimaryColumn({ name: "expense_id", type: "varchar" })
  expenseId!: string;

  @Column({ name: "group_id", type: "varchar" })
  groupId!: string;

  @Column({ name: "amount", type: "integer" })
  amount!: number;

  @Column({ name: "payer_id", type: "varchar" })
  payerId!: string;

  @Column({ name: "participants", type: "text" })
  participants!: string; // JSON文字列

  @Column({ name: "description", type: "text", nullable: true })
  description?: string;

  @Column({ name: "created_at", type: "timestamp", nullable: true })
  createdAt?: Date;

  @Column({ name: "deleted", type: "boolean", default: false })
  deleted!: boolean;
}

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || "user",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_DATABASE || "database",
  synchronize: false,
  logging: false,
  entities: [ExpenseEntity],
});

let repo: Repository<ExpenseEntity> | null = null;
async function getRepo() {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  if (!repo) {
    repo = AppDataSource.getRepository(ExpenseEntity);
  }
  return repo;
}

export class ExpenseRepository {

  async findAllByGroupId(groupId: string): Promise<Expense[]> {
    const repository = await getRepo();
    const rows = await repository.find({
      where: { groupId, deleted: false },
    });
    return rows.map(row => ({
      expenseId: row.expenseId,
      groupId: row.groupId,
      amount: row.amount,
      payerId: row.payerId,
      participants: JSON.parse(row.participants),
      description: row.description ?? undefined,
      createdAt: row.createdAt?.toISOString?.() ?? undefined,
      deleted: row.deleted,
    }));
  }

  async findById(expenseId: string): Promise<Expense | undefined> {
    const repository = await getRepo();
    const row = await repository.findOneBy({ expenseId, deleted: false });
    if (!row) return undefined;
    return {
      expenseId: row.expenseId,
      groupId: row.groupId,
      amount: row.amount,
      payerId: row.payerId,
      participants: JSON.parse(row.participants),
      description: row.description ?? undefined,
      createdAt: row.createdAt?.toISOString?.() ?? undefined,
      deleted: row.deleted,
    };
  }

  async create(expense: Expense): Promise<void> {
    const repository = await getRepo();
    const entity = repository.create({
      expenseId: expense.expenseId,
      groupId: expense.groupId,
      amount: expense.amount,
      payerId: expense.payerId,
      participants: JSON.stringify(expense.participants),
      description: expense.description ?? undefined,
      createdAt: expense.createdAt ? new Date(expense.createdAt) : new Date(),
      deleted: expense.deleted ?? false,
    });
    await repository.save(entity);
  }

  async update(expenseId: string, update: Partial<Expense>): Promise<boolean> {
    const repository = await getRepo();
    const updateData: Partial<ExpenseEntity> = {};
    if (update.groupId !== undefined) updateData.groupId = update.groupId;
    if (update.amount !== undefined) updateData.amount = update.amount;
    if (update.payerId !== undefined) updateData.payerId = update.payerId;
    if (update.participants !== undefined) updateData.participants = JSON.stringify(update.participants);
    if (update.description !== undefined) updateData.description = update.description;
    if (update.createdAt !== undefined) updateData.createdAt = new Date(update.createdAt);
    if (update.deleted !== undefined) updateData.deleted = update.deleted;
    if (Object.keys(updateData).length === 0) return false;
    const res = await repository.update({ expenseId }, updateData);
    return (res.affected ?? 0) > 0;
  }

  async delete(expenseId: string): Promise<boolean> {
    const repository = await getRepo();
    const res = await repository.update(
      { expenseId, deleted: false },
      { deleted: true }
    );
    return (res.affected ?? 0) > 0;
  }
}
