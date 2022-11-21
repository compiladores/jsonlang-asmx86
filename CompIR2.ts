/**
 * CompiIR1 without variable names or scopes
 */
type Label = string;
export type StatementIR2<Expr> =
  | { push: Expr }
  | { bz: Label }
  | { bnz: Label }
  | { jmp: Label }
  | { set: number; value: Expr }
  | { call: string; args: Expr[] }
  | { return: Expr }
  | {
    functionIntro: number[];
  }
  | { lbl: Label };

type Binops =
  | "+"
  | "-"
  | "*"
  | "/"
  | "^"
  | "%"
  | "&"
  | "|"
  | ">>"
  | "<<"
  | "<"
  | "<="
  | ">"
  | ">="
  | "=="
  | "~="
  | "and"
  | "or";

export type Expression =
  | { unop: "-" | "!" | "~"; arg: Expression }
  | { binop: Binops; argl: Expression; argr: Expression }
  | number
  | { call: Label; args: Expression[] }
  | { literal: number };

export type CompIR2 = StatementIR2<Expression>;
