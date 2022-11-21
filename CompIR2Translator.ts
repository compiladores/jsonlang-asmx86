import { CompIR2, Expression, StatementIR2 } from "./CompIR2.ts";
import { CompIR3, StatementIR3 } from "./CompIR3.ts";

function translateOne(stmt: StatementIR2<Expression>): StatementIR3[] {
  if (typeof stmt != "object" || !("push" in stmt || "set" in stmt || "call" in stmt || "return" in stmt))
    return [stmt];

  if ("push" in stmt) {
    return translateExpr(stmt.push);
  }

  if ("set" in stmt) {
    const expr = translateExpr(stmt.value);

    return [
      ...expr,
      {pop: stmt.set}
    ];
  }

  if ("call" in stmt) {
    const instrucciones_arg = new Array<StatementIR3>();
    for (const expressions of stmt.args.reverse()) {
      instrucciones_arg.push(...translateExpr(expressions));
    }

    return [
      "callBegin",
      ...instrucciones_arg,
      {callEnd: stmt.call}
    ];
  }

  if ("return" in stmt) {
    return [
      ...translateExpr(stmt.return),
      "return"
    ]
  }

  throw Error("no se encontró el tipo de statment");
}

export function translate(code: CompIR2[]): CompIR3[] {
  return code.flatMap((command) => translateOne(command));
}

//la instruccion que genera translateExpr, deja la expresion
// almacenada en el stack.
function translateExpr(expr: Expression): StatementIR3[] {
  if (typeof expr != "object") {
    //number
    return [{push: expr}];
  }

  if ("call" in expr) {
    // NEW
    // El push -2 es para poner en el stack el valor de retorno.
    return [...translateOne(expr), {push: -2}];

    // return translateOne(expr);
  }

  if ("unop" in expr) {
    const inner_expr = translateExpr(expr.arg);
    return [
      ...inner_expr,
      (expr.unop=="-")?"neg":expr.unop
    ];
  }

  if ("binop" in expr) {
    const left_expr = translateExpr(expr.argl);
    const right_expr = translateExpr(expr.argr);

    return [
      ...right_expr,
      ...left_expr,
      expr.binop
    ];
  }

  if ("literal" in expr) {
    return [{push: expr}]
  }

  throw new Error("No se encontró el tipo de expresion");
}