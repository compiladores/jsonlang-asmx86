export type Statement<Expr> = 
| {
  if: { cond: Expr; then: Statement<Expr> }[];
  else?: Statement<Expr>;
}
| { while: Expr; do: Statement<Expr> }
| Statement<Expr>[]
| { iterator: string; from: Expr; to: Expr; step?: Expr; do: Statement<Expr> }
| { do: Statement<Expr>; until: Expr }
| "break"
| "continue"
| { declare: string; value: Expr }
| { set: string; value: Expr }
| { call: string; args: Expr[] }
| { return: Expr }


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
  | { call: string; args: Expression[] }
  | number;

export type DeclarationStatement<Stmt>={
  function: string;
  args: string[];
  block: Stmt;
};

export type TopStatement<Expr> = Statement<Expr> | DeclarationStatement<Statement<Expr>>

export type JsonLang = TopStatement<Expression>[];

export type CompIR0 = JsonLang