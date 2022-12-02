/**
 * CompiIR2 without expressions
 */
type Label = string;
export type StatementIR3 =
  | { enter: [Literal, {literal: 0}]}
  | { cmpq: double_operand }
  | { pushq: Data_or_literal }
  | { je: Label }
  | { jne: Label }
  | { jmp: Label }
  | { popq: Data }
  | "callBegin"
  | { callEnd: Label }
  | "return"
  | {
    functionIntro: Stack_ubication[];
  }
  | Binops
  | Unops
  | { lbl: Label };

type Binops =
  | {addq: double_operand}    // "+"
  | {subq: double_operand}    // "-"  
  // | {imul: [data, Register]}  // | "*"
  // | {idiv: data}  // | "/"
  // | {}  // | "^"
  // | {}  // | "%"
  // | {}  // | "&"
  // | {}  // | "|"
  // | {}  // | ">>"
  // | {}  // | "<<"
  // | {}  // | "<"
  // | {}  // | "<="
  // | {}  // | ">"
  // | {}  // | ">="
  // | {}  // | "=="
  // | {}  // | "~="
  // | {}  // | "and"
  // | {}  ;// | "or";
  
type Unops = 
  | {negq: Data}  // | "neg"
    // | "!"
    // | "~";

export type Data =
  | Stack_ubication
  | Register;

type Data_or_literal =
  | Data
  | Literal

type Literal = {literal: number}

export type double_operand = 
  | [Register, Data]
  | [Data, Register]
  | [Literal, Data];

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
  | "r11"
  | "r12"
  | "r13"
  | "r14"
  | "r15"
  | ip_register;

export type CompIR3 = StatementIR3;
