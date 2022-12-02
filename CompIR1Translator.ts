import { CompIR1, Expression as ExpressionIR1 } from "./CompIR1.ts";
import { CompIR2, Expression as ExpressionIR2 } from "./CompIR2.ts";

export class LocalContext {
  private padre: LocalContext|null;
  private hash = new Map<string, number>();
  private es_contexto_funcion: boolean;

  constructor(padre:(LocalContext|null) = null, es_contexto_funcion = false) {
    this.padre = padre;
    this.es_contexto_funcion = es_contexto_funcion;
  }

  es_funcion(): boolean {
    return this.es_contexto_funcion;
  }

  es_global(): boolean {
    return (this.padre == null);
  }

  exit_context(): LocalContext {
    if (this.padre == null) {
      throw new Error("No se puede salir salir de contexto global");
    }

    return this.padre;
  }

  createAndGetId(n: string, id: number): number {
    if (this.hash.has(n)) {
      throw Error("Ya existe esta variable en contexto local actual");
    }

    this.hash.set(n, id);
    return id;
  }

  getId(n: string): number|false {
    const resultado = this.hash.get(n)
    if (resultado != undefined) {
      return resultado;
    }

    if (this.padre != null) {
      return this.padre.getId(n);
    } else {
      return false;
    }
  }
}

export class Context {
  private localContext = new LocalContext(null, true);
  private globalContext = this.localContext;
  private proximo_id = 1;

  // Declare
  createAndGetId(n: string): number {
    if (n == "out") {
      this.globalContext.createAndGetId(n, 0)
      return 0;
    }

    const resultado = this.localContext.createAndGetId(n, this.proximo_id);
    this.proximo_id++;

    return resultado;
  }

  //set y get
  getId(n: string): number {
    if (n == "out") {
      if (this.globalContext.getId(n) === false) {
        return this.globalContext.createAndGetId(n, 0);
      }
      return 0;
    }


     let resultado = this.localContext.getId(n)

     if (resultado === false) {
      resultado = this.globalContext.createAndGetId(n, this.proximo_id)
      this.proximo_id++;
     }

     return resultado;
  }
  
  enterFunction(): void {
    this.localContext = new LocalContext(this.localContext, true);
  }

  exitFunction(): void {
    //no llego al contexto global, porque contexto global es funcion.
    while (!this.localContext.es_funcion()) {
      this.localContext = this.localContext.exit_context();
    }

    if (this.localContext.es_global()) {
      throw new Error("No se encontraba en ninguna funcion de la que se pueda salir");
    }

    this.localContext = this.localContext.exit_context();
  }

  enterBlock(): void {
    this.localContext = new LocalContext(this.localContext, false);
  }

  exitBlock(): void {
    if (this.localContext.es_global()) {
      throw new Error("No se puede salir del contexto global");
    }

    if (this.localContext.es_funcion()) {
      throw new Error("no se puede salir de bloque si esta en scope funcion")
    }

    this.localContext = this.localContext.exit_context();
  }

  getVariableCount(): number {
    return (this.proximo_id + 1)
  }
}

export function translate(code: CompIR1[]): CompIR2[] {
  const context = new Context();
  const ir2_code = code.flatMap((stmt: CompIR1): CompIR2[] => {
    if (stmt === "enterBlock") {
      context.enterBlock();
      return [];
    }
    if (stmt === "exitBlock") {
      context.exitBlock();
      return [];
    }
    if (stmt === "functionEnd") {
      context.exitFunction();
      return [];
    }
    if ("return" in stmt) {
      return [{ return: translateExpr(stmt.return, context) }];
    }
    if ("declare" in stmt) {
      return [{
        set: context.createAndGetId(stmt.declare),
        value: translateExpr(stmt.value, context),
      }];
    }
    if ("set" in stmt) {
      return [{
        set: context.getId(stmt.set),
        value: translateExpr(stmt.value, context),
      }];
    }
    
    if ("cmpq" in stmt) {
      return [{
        cmpq: [translateExpr(stmt.cmpq[0], context), translateExpr(stmt.cmpq[1], context)]
      }]
    }

    if ("functionIntro" in stmt) {
      const variables: number[] = [];

      context.enterFunction();

      for (const varname of stmt.functionIntro) {
        variables.push(context.createAndGetId(varname));
      }
      return [{
        functionIntro: variables
      }]
    }
    
    if ("call" in stmt) {
      const expressions: ExpressionIR2[] = [];

      for (const expr_single of stmt.args) {
        expressions.push(translateExpr(expr_single, context));
      }
      return [{
        call: stmt.call,
        args: expressions
      }]
    }

    return [stmt];
  });

  const bytes_necesitados = 8*context.getVariableCount()
  const bytes_redondeado_a_multiplo_16 = Math.ceil(bytes_necesitados/16)*16

  ir2_code.splice(0, 0, {enter: [{literal: bytes_redondeado_a_multiplo_16}, {literal: 0}]})

  return ir2_code;
}

function translateExpr(
  expr: ExpressionIR1,
  context: Context,
): ExpressionIR2 {
  if (typeof expr == "object") {
    if ("unop" in expr) {
      return {unop: expr.unop,
              arg: translateExpr(expr.arg, context)}

    } else if ("binop" in expr) {
      return {binop: expr.binop,
              argl: translateExpr(expr.argl, context),
              argr: translateExpr(expr.argr, context)}

    } else if ("call" in expr) {
      const new_args = new Array<ExpressionIR2>();

      for (const arg of expr.args) {
        new_args.push(translateExpr(arg, context));
      }

      return {call: expr.call,
              args: new_args}
    }
  }

  if (typeof expr == "string") {
    return context.getId(expr);
  }

  if (typeof expr == "number") {
    return {literal: expr};
  }

  throw new Error("No debería llegar nunca");
}
