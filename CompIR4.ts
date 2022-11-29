/**
 * CompiIR3 without functions
 * take advantage of PC located at -1
 */
type Label = string;
export type StatementIR4 =
  | { enter: Literal }
  | { leave: ""}
  | { cmpq: double_operand}
  | { movq: double_operand}
  | { pushq: Data_and_literal }
  | { je: Label }
  | { jne: Label }
  | { jmp: Label }
  | { popq: Data }
  | Binops
  | Unops
  | { lbl: Label }
  | { call: Label }
  | { ret: "" }

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

type Data =
  | Stack_ubication
  | Register;

type Data_and_literal =
  | Data
  | Literal

type Literal = {literal: number}

type double_operand = 
  | [Register, Data]
  | [Data, Register]
  | [Literal, Data];

type Stack_ubication = number

export type argument_register =
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

export type CompIR4 = StatementIR4;
