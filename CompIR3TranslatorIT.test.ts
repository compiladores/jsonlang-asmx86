import { translate as translateIR3 } from "./CompIR3Translator.ts";
import { translate as translateIR4 } from "./CompIR4Translator.ts";
import { assertEquals } from "https://deno.land/std@0.155.0/testing/asserts.ts";
import { execute } from "./CompIr5Vm.ts";

Deno.test("simple function from the header called below", () => {
  const translated = translateIR3([
    { jmp: "after_fun" },
    { lbl: "the_fun" },
    { functionIntro: [201, 202] },
    { push: 201 },
    { push: 202 },
    "+",
    "return",
    { lbl: "after_fun" },
    "callBegin",
    { push: { literal: 11 } },
    { push: { literal: 12 } },
    { callEnd: "the_fun" },
    { push: -2},
    { pop: 0 },
  ]);
  const m = execute(translateIR4(translated));
  assertEquals(m[0], 23);
});


// Deno.test("x2 recrsive funcution", () => {
//   const translated = translateIR3([
    
//   ]);
// })
