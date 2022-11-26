/**
 * CompiIR2 without expressions
 */
type Label = string;
export type StatementIR3 =
  | { movq: [data_and_literal, data]}
  | { pushq: data_and_literal }
  | { je: Label }
  | { jne: Label }
  | { jmp: Label }
  | { popq: data }
  | "callBegin"
  | { callEnd: Label }
  | "return"
  | {
    functionIntro: data[];
  }
  | Binops
  | Unops
  | { lbl: Label };

type Binops =
  | {addq: [data_and_literal, data]}  // | "+"  
  | {subq: [data_and_literal, data]}  // | "-"
  // | {imul: [data, Register]}  // | "*"
  // | {idiv: data}  // | "/"
  // | {}  // | "^"
  // | {}  // | "%"
  | {}  // | "&"
  | {}  // | "|"
  | {}  // | ">>"
  | {}  // | "<<"
  | {}  // | "<"
  | {}  // | "<="
  | {}  // | ">"
  | {}  // | ">="
  | {}  // | "=="
  | {}  // | "~="
  | {}  // | "and"
  | {}  ;// | "or";
type Unops = 
  | "neg"
  | "!"
  | "~";

type data =
  | Stack_ubication
  | Register;

type data_and_literal =
  | data
  | {literal: number};

type Stack_ubication = number

type argument_register =
  | "rdi"
  | "rsi"
  | "rdx"
  | "rcx"
  | "r8"
  | "r9";

type return_register =
  "rax";

type ip_register =
  "rip";


type Register = 
  | argument_register
  | return_register
  | "rbx"
  | "rsp"
  | "rbp"
  | "r10"
  // | "r11"
  | "r12"
  | "r13"
  | "r14"
  | "r15"
  | ip_register;

export type CompIR3 = StatementIR3;
