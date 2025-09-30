// src/domain/errors.ts
export class DomainError extends Error {
  code: string;
  status?: number;
  details?: unknown;

  constructor(code: string, message: string, status?: number, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, DomainError.prototype);
  }

  static from(
    code: string,
    message?: string,
    options?: { status?: number; details?: unknown }
  ): DomainError {
    return new DomainError(
      code,
      message ?? code,
      options?.status,
      options?.details
    );
  }
}
