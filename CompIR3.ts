/**
 * CompiIR2 without expressions
 */
type Label = string;
export type StatementIR3 =
  | { enter: [Literal, {literal: 0}]}
  | { movq: double_operand}
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
  | register8bit
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

export type CompIR3 = StatementIR3;
