import { translate } from "./CompIR4Translator.ts";
import { assertEquals } from "https://deno.land/std@0.155.0/testing/asserts.ts";

Deno.test("CompIR4Translator", () => {
  const ir5 = translate([
    { directive: [".global", "main"]},
    { directive: [".string", "%li\n"]},
    { lbl: "main"},
    { leaq: [{relative: "str_print"}, "rdi"]},
    { lbl: "a" },
    { jmp: "a" },
    { jmp: "a" },
    { lbl: "b" },
    { jmp: "a" },
    { je: "b" },
    { jne: "d" },
    { jmp: "a" },
    { lbl: "d" },
    { enter: [{literal: 5}, {literal: 0}] },
    { leave: ""},
    { cmpq: [{literal: 10}, 0] },
    { movq: ["rax", 1] },
    { pushq: 2 },
    { popq: 4 },
    { addq: ["rbx", "rcx"]},
    { negq: 3},
    { call: "a" },
    { ret: "" }
  ]);

  const string = 
`.global main
.string "%li\\n"

main:
\tleaq\tstr_print(%rip), %rdi

a:
\tjmp\ta
\tjmp\ta

b:
\tjmp\ta
\tje\tb
\tjne\td
\tjmp\ta

d:
\tenter\t$5, $0
\tleave
\tcmpq\t$10, -8(%rbp)
\tmovq\t%rax, -16(%rbp)
\tpushq\t-24(%rbp)
\tpopq\t-40(%rbp)
\taddq\t%rbx, %rcx
\tnegq\t-32(%rbp)
\tcall\ta
\tret
`

  assertEquals(ir5, string);
});
