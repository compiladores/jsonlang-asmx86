/**
 * CompiIR3 without functions
 * take advantage of PC located at -1
 */
type Label = string;
export type StatementIR4 =
  | { push: number | { literal: number } | "pc" }
  | { bz: Label }
  | { bnz: Label }
  | { jmp: Label }
  | { pop: number | "pc" }
  | Binops
  | Unops
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
type Unops = "neg" | "!" | "~";

export type CompIR4 = StatementIR4;
