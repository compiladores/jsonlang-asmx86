/**
 * JsonLang without control structures
 * (expressions from control structures
 * are pushed before being checked)
 */

type Label = string;
export type StatementIR1<Expr> =
  | { cmpq: [Expr, Expr]}
  | { pushq: Expr }
  | { je: Label }
  | { jne: Label }
  | { jmp: Label }
  | { declare: string; value: Expr }
  | { set: string; value: Expr }
  | { call: string; args: Expr[] }
  | { return: Expr }
  | {
    functionIntro: string[];
  }
  | { lbl: Label }
  | "enterBlock"
  | "exitBlock"
  | "functionEnd";

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
  | string
  | { call: Label; args: Expression[] }
  | number;

export type CompIR1 = StatementIR1<Expression>;
