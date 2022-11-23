/**
 * CompiIR4 without labels
 */
type Offset = number;
export type Statement =
  | { push: number | { literal: number }|"pc" }
  | { bz: Offset }
  | { bnz: Offset }
  | { jmp: Offset }
  | { pop: number|"pc" }
  | Binops
  | Unops;

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

export type CompIr5Command = Statement;
export type CompIR5 = CompIr5Command[];
