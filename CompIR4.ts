/**
 * CompiIR3 without functions
 * y agrega cosas especiales
 */
export type operands =
  | Literal           // {literal: number}
  | double_operand    // [Register, Data]
                      //|[Data, Register]
                      //|[Literal, Data]
                      
  | Stack_ubication   // number
  | Register          // string
  | Label             // string
  | ""                // string
  | Relative_Label;   // {relative: Label}

export type Label = string;
export type Relative_Label = {relative: Label};
export type StatementIR4 =
  | { leaq: [Relative_Label, Register]}
  | { directive: [string, Label] }
  | { enter: [Literal, {literal: 0}] }
  | { leave: ""}
  | { cmpq: double_operand }
  | { movq: double_operand }
  | { pushq: Data_or_literal }
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
  | {imulq: [Data, Register]}  // | "*"
  | {idivq: Data}  // | "/"
  // | call pow()  // | "^"
  // | {}  // | "%"
  | {andq: double_operand}  // | "&"
  | {orq: double_operand}  // | "|"
  | {sarq: ["cl"|Literal, Data]}  // | ">>"
  | {salq: ["cl"|Literal, Data]}  // | "<<"
  | {setl: register8bit|Stack_ubication}  // | "<"
  | {setle: register8bit|Stack_ubication}  // | "<="
  | {setg: register8bit|Stack_ubication}  // | ">"
  | {setge: register8bit|Stack_ubication}  // | ">="
  | {sete: register8bit|Stack_ubication}  // | "=="
  | {setne: register8bit|Stack_ubication}  // | "~="
  // | {}  // | "and"
  // | {}  ;// | "or";
  | {xorq: double_operand}
  | {dec: Data}
  | {cqto: ""}  //Extiende el signo de RAX a RDX
  
type Unops = 
  | {negq: Data}  // | "neg"
    // | "!"
  | {notq: Data}  // | "~";

type Data =
  | Stack_ubication
  | Register;

type Data_or_literal =
  | Data
  | Literal

export type Literal = {literal: number}

export type double_operand = 
  | [Register, Data]
  | [Data, Register]
  | [Literal, Data];

export type Stack_ubication = number

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


export type Register = 
  | argument_register
  | return_register
  | register8bit
  | "al"
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

type register8bit =
  | "al"
  | "bl"
  | "cl"
  | "dl"


export type CompIR4 = StatementIR4;
