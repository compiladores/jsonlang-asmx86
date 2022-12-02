/**
 * CompiIR1 without variable names or scopes
 */
type Label = string;
export type StatementIR2<Expr> =
  | { enter: [{literal: number}, {literal: 0}]}
  | { cmpq: [Expr, Expr]}
  | { je: Label }
  | { jne: Label }
  | { jmp: Label }
  | { set: Stack_ubication; value: Expr }
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
  | Stack_ubication  //Represents ubuication in stack
  | { call: Label; args: Expression[] }
  | { literal: number }
  | { register: Register};

export type CompIR2 = StatementIR2<Expression>;

type Stack_ubication = number

type Argument_register =
  | "rdi"
  | "rsi"
  | "rdx"
  | "rcx"
  | "r8"
  | "r9"

type Return_register =
  "rax";

type Ip_register =
  "rip";

type Register = 
  | Argument_register
  | Return_register
  | "rbx"
  | "rsp"
  | "rbp"
  | "r10"
  | "r11"
  | "r12"
  | "r13"
  | "r14"
  | "r15"
  | Ip_register;
