import { CompiIr5, CompiIr5Command } from "./CompIR5.ts";

export class CompIr5Vm {
  private stack: number[] = [];
  private memory: Record<number, number> = {};
  private program: CompiIr5Command[] = [];
  private programCounter = 0;
  private runOne(command: CompiIr5Command) {
    const s = this.stack;
    const m = this.memory;
    function monop(f: (x: number) => number) {
      const v = s.pop();
      if (v === undefined) {
        throw new Error("CANT POP");
      }
      s.push(f(v));
    }
    function binop(f: (l: number, r: number) => number) {
      const l = s.pop();
      const r = s.pop();
      if (l === undefined || r === undefined) {
        throw new Error("CANT POP");
      }
      s.push(f(l, r));
    }
    if (typeof command === "object") {
      if ("push" in command) {
        if (command.push === "pc") {
          s.push(this.programCounter);
        }
        if (typeof command.push === "number") {
          s.push(m[command.push]);
        }
        if (typeof command.push === "object") {
          s.push(command.push.literal);
        }
      }
      if ("bz" in command) {
        if (s.at(-1) === 0) {
          this.programCounter += command.bz;
          s.pop();
          return;
        }
        s.pop();
      }
      if ("bnz" in command) {
        if (s.at(-1) !== 0) {
          this.programCounter += command.bnz;
          s.pop();
          return;
        }
        s.pop();
      }
      if ("jmp" in command) {
        this.programCounter += command.jmp;
        return;
      }
      if ("pop" in command) {
        const v = this.stack.pop();
        if (v === undefined) {
          throw new Error("CANT POP");
        }
        if (command.pop === "pc") {
          this.programCounter = v;
          return;
        } else {
          m[command.pop] = v;
        }
      }
    } else {
      switch (command) {
        case "!":
          monop((x) => +(x === 0));
          break;
        case "%":
          binop((l, r) => l % r);
          break;
        case "&":
          binop((l, r) => l & r);
          break;
        case "*":
          binop((l, r) => l * r);
          break;
        case "+":
          binop((l, r) => l + r);
          break;
        case "-":
          binop((l, r) => l - r);
          break;
        case "/":
          binop((l, r) => l / r);
          break;
        case "<":
          binop((l, r) => +(l < r));
          break;
        case "<<":
          binop((l, r) => l << r);
          break;
        case "<=":
          binop((l, r) => +(l <= r));
          break;
        case "==":
          binop((l, r) => +(l == r));
          break;
        case ">":
          binop((l, r) => +(l > r));
          break;
        case ">=":
          binop((l, r) => +(l >= r));
          break;
        case ">>":
          binop((l, r) => (l >> r));
          break;
        case "^":
          binop((l, r) => {
            return Math.pow(l, r);
          });
          break;
        case "and":
          binop((l, r) => +(l && r));
          break;
        case "or":
          binop((l, r) => +(l || r));
          break;
        case "|":
          binop((l, r) => (l | r));
          break;
        case "~=":
          binop((l, r) => +(l != r));
          break;
        case "neg":
          monop((x) => -x);
          break;
        case "~":
          monop((x) => ~x);
          break;
      }
    }

    this.programCounter += 1;
  }
  public feed(commands: CompiIr5Command[]) {
    this.program = [...this.program, ...commands];
  }
  public runUntilFinished() {
    while (this.programCounter < this.program.length) {
      this.runOne(this.program[this.programCounter]);
    }
    return { ...this.memory };
  }
}

export function execute(ir: CompiIr5) {
  const ex = new CompIr5Vm();
  ex.feed(ir);
  return ex.runUntilFinished();
}
