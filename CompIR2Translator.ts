import { CompIR2, Expression, StatementIR2 } from "./CompIR2.ts";
import { CompIR3, StatementIR3 } from "./CompIR3.ts";

function translateOne(stmt: StatementIR2<Expression>): StatementIR3[] {
  stmt;
  if (typeof stmt != "object" || !("cmpq" in stmt || "set" in stmt || "call" in stmt || "return" in stmt))
    return [stmt];

  if ("cmpq" in stmt) {
    const ir3: StatementIR3[] = [];

    ir3.push(...translateExpr(stmt.cmpq[0]));
    ir3.push(...translateExpr(stmt.cmpq[1]));

    ir3.push({popq: "rbx"})
    ir3.push({popq: "rax"})

    ir3.push({cmpq: ["rax", "rbx"]});

    return ir3;
  }

  if ("set" in stmt) {
    const ir3: StatementIR3[] = [];

    ir3.push(...translateExpr(stmt.value));

    ir3.push({popq: stmt.set})

    return ir3;
  }

  if ("call" in stmt) {
    const instrucciones_arg: StatementIR3[] = [];

    const registers = ["rdi", "rsi", "rdx", "rcx", "r8", "r9"];

    while (stmt.args.length > 0 && registers.length > 0) {
      const parameter = stmt.args.shift()
      const register = registers.shift();
      if (parameter == undefined || register == undefined) {
        throw new Error("PARAMETRO O REGISTRO ES UNDEFINED");       
      }

      const expression = translateExpr(parameter)
      instrucciones_arg.push(...expression);
      instrucciones_arg.push({popq: register})
    }

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
      {popq: "rax"},
      "return"
    ]
  }

  throw Error("no se encontró el tipo de statment");
}

export function translate(code: CompIR2[]): CompIR3[] {
  return code.flatMap((command) => translateOne(command));
}

//va recursivcamente a izquierda, luego derecha
// caso base: pushea en stack el valor
// no caso base, popea en B, popea en A, realiza op B,A; luego pushea A
function translateExpr(expr: Expression): StatementIR3[] {
  if (typeof expr == "number" || "literal" in expr) {
    return [{pushq: expr}];
  }

  if ("register" in expr) {
    return [{pushq: expr.register}]
  }

  if ("call" in expr) {
    return [...translateOne(expr),
            {pushq: "rax"}];
  }

  if ("unop" in expr) {
    const inner_expr = translateExpr(expr.arg);
    const operation = [{negq: "rax"}];

    if (expr.unop != "-") {
      throw new Error("NO ESTA IMPLEMENTADO EL OPERADOR UNARIO " + expr.unop);
    }

    return [
      ...inner_expr,
      {popq: "rax"},
      ...operation,
      {pushq: "rax"}
    ];
  }

  if ("binop" in expr) {
    //TODO: IMPLEMENTAR TODOS LOS UNOPS. TAL VEZ CON UN DICCIONARIO?
    const left_expr = translateExpr(expr.argl);
    const right_expr = translateExpr(expr.argr);
    let operation;
    
    if (expr.binop == "+") {
      operation = [{addq: ["rbx", "rax"]}];
    } else if (expr.binop == "-") {
      operation = [{subq: ["rbx", "rax"]}];
    } else {
      throw new Error("NO ESTA IMPLEMENTADO EL OPERADOR BINARIO " + expr.binop);
    }

    return [
      ...left_expr,
      ...right_expr,
      {popq: "rbx"},
      {popq: "rax"},
      ...operation,
      {pushq: "rax"}
    ];
  }

  throw new Error("No se encontró el tipo de expresion");
}