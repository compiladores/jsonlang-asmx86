import { CompIR1 } from "./CompIR1.ts";
import { Expression, JsonLang, Statement } from "./CompIR0.ts";

class LabelFactory {
  private next = 0;
  createLabel() {
    const ret = "l" + this.next;
    this.next += 1;
    return ret;
  }
}

interface JumpLabels {
  continueLbl: string;
  breakLbl: string;
}

function translateGeneral(stmt: Statement<Expression>,
                          labelFactory: LabelFactory,
                          jumps: JumpLabels | null ):  CompIR1[] {
      
  if (stmt === "break") { // dejar como ejercicio 00
    if (!jumps?.breakLbl) {
      throw new Error("Cant break from this context");
    }
    return [{ jmp: jumps?.breakLbl }];
  }
  
  else if (stmt === "continue") { // dejar como ejercicio 00
    if (!jumps?.continueLbl) {
      throw new Error("Cant break from this context");
    }
    return [{ jmp: jumps?.continueLbl }];
  }

  else if (stmt instanceof Array) {
    const ir1 = new Array<CompIR1>();
    
    ir1.push("enterBlock");

    for (const individual_stmt of stmt) {
      ir1.push(...translateGeneral(individual_stmt, labelFactory, jumps))
    }

    ir1.push("exitBlock")
    return ir1;
  }

  else if ("if" in stmt) {
    const if_list = stmt.if;
    const ir1 = new Array<CompIR1>();
    const labels = new Array<string>;
    ir1.push("enterBlock");

    if (if_list.length < 1) {
      throw Error("If incorrecto")
    }

    for (let i = 0; i < if_list.length; i++) {
      labels.push(labelFactory.createLabel());
    }

    if (stmt.else) {
      labels.push(labelFactory.createLabel());
    }

    for (let i = 0; i < if_list.length; i++) {
      const parte_if = if_list[i]
      
      const content = [
        {cmpq: [0,parte_if.cond]},
        {je: labels[i]},
        ...remove_external_block(translateGeneral(parte_if.then, labelFactory, jumps)),
        {jmp: labels[labels.length-1]},      
        {lbl: labels[i]} 
      ]
      
      ir1.push(...content)
    }

    if (stmt.else) {
      ir1.push(...remove_external_block(translateGeneral(stmt.else, labelFactory, jumps)))
      ir1.push({lbl: labels[labels.length-1]})
    } else {
      const lbl_temp = ir1.pop()
      ir1.pop()
      ir1.push(lbl_temp?lbl_temp:{lbl: "ERROR"});
    }

    ir1.push("exitBlock");

    return ir1;

  
  } else if ("iterator" in stmt) {
    const ir1 = new Array<CompIR1>();
    ir1.push("enterBlock");
    ir1.push({declare: stmt.iterator, value: stmt.from});
    const cond:Expression = {binop: "<=", argl: stmt.iterator, argr: stmt.to};
    let step_value:Expression = 1;

    if (stmt.step) {
      step_value = stmt.step;
      
      if (stmt.step < 0) {
        cond.binop = ">=";
      }
    } 

    const doOfWhile = (stmt.do instanceof Array)?stmt.do:[stmt.do];
    doOfWhile.push({set: stmt.iterator, value: {binop: "+", argl: stmt.iterator, argr: step_value}})

    const while_constr = {while: cond, do: doOfWhile};

    const while_instructions = remove_external_block(translateGeneral(while_constr, labelFactory, jumps));

    ir1.push(...while_instructions)
    ir1.push("exitBlock");

    return ir1;
  }
  
  else if ("until" in stmt) {
    const ir1 = new Array<CompIR1>();

    ir1.push("enterBlock")
    ir1.push(...remove_external_block(translateGeneral(stmt.do, labelFactory, jumps)));

    const doOfWhile = (stmt.do instanceof Array)?stmt.do:[stmt.do];
    const expresion: Expression = {unop: "!", arg:stmt.until}
    const while_constr = {while: expresion, do: doOfWhile};

    const while_instructions = remove_external_block(translateGeneral(while_constr, labelFactory, jumps));
    
    ir1.push(...while_instructions);
    ir1.push("exitBlock");

    return ir1;
  } 

  else if ("while" in stmt) { // dejar como ejercicio 00
    const beginWhile = labelFactory.createLabel();
    const endWhile = labelFactory.createLabel();

    const contenidoWhile = remove_external_block(translateGeneral(stmt.do, labelFactory, {
      breakLbl: endWhile,
      continueLbl: beginWhile,
    }))


    return [
      "enterBlock",
      { lbl: beginWhile },
      { cmpq: [0,stmt.while] },
      { je: endWhile },
      ...contenidoWhile,
      { jmp: beginWhile },
      { lbl: endWhile },
      "exitBlock"
    ];
  }
  
  else {
    return [stmt];
  }

}

export function translate(code: JsonLang): CompIR1[] {
  const labelFactory = new LabelFactory();
  return code.flatMap((c) => {
    if (typeof c === "object" && "function" in c) {
      const afterFunction = labelFactory.createLabel();
      return [
        { jmp: afterFunction },
        { lbl: c.function },
        { functionIntro: c.args },
        ...remove_external_block(translateGeneral(c.block, labelFactory, null)),
        "functionEnd",
        { lbl: afterFunction },
      ];
    } else {
      return translateGeneral(c, labelFactory, null);
    }
  });
}


function remove_external_block(stmt: CompIR1[]): CompIR1[] {
  if (stmt[0] == "enterBlock" && stmt[stmt.length-1] == "exitBlock") {
    stmt.shift()
    stmt.pop()
  }

  return stmt;
}
