/**
 * CompiIR2 without expressions
 */
type Label = string;
export type StatementIR3 =
  | { push: number | { literal: number } }
  | { bz: Label }
  | { bnz: Label }
  | { jmp: Label }
  | { pop: number }
  | "callBegin"
  | { callEnd: Label }
  | "return"
  | {
    functionIntro: number[];
  }
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

export type CompIR3 = StatementIR3;
