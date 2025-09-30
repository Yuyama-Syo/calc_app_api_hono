// user.service.ts
import { ListUsersQuery } from "../schema/user.schema";
import { DomainError } from "../domain/errors";
// auth.service.ts の users を直接利用
import { users } from "./auth.service";

export type UserListItem = {
  id: string;
  email: string;
  displayName: string;
};

export class UserService {
  list(query: ListUsersQuery): UserListItem[] {
    const { page = 1, limit = 50 } = query;
    if (page < 1 || limit < 1 || limit > 100) {
      throw new DomainError("VALIDATION_ERROR", "page/limit値が不正です");
    }
    // users: Map<string, User>
    const userArr = Array.from(users.entries());
    // TODO: email全件返すのは将来セキュリティ検討
    const sliced = userArr.slice((page - 1) * limit, page * limit);
    return sliced.map(([email, u]) => ({
      id: email,
      email: u.email,
      displayName: u.email, // displayName未定なのでemailで代用
    }));
  }
}
