import { translate as translateIR3 } from "./CompIR3Translator.ts";
import { assertEquals } from "https://deno.land/std@0.155.0/testing/asserts.ts";

Deno.test("simple function from the header called below", () => {
  let ir4 = translateIR3([
    { jmp: "after_fun" },
    { lbl: "the_fun" },
    { functionIntro: [] },
    { pushq: {literal: 10} },
    { popq: "rax" },
    "return",
    { lbl: "after_fun" },
    "callBegin",
    { callEnd: "the_fun" },
    { pushq: "rax" },
    { popq: 0 },
  ]);

  // ? QUE PROBAR

  assertEquals(ir4, [
    { directive: [".global", "main"] },
    { lbl: "str_print"},
    { directive: [".string", "%lf\n"]},
    { lbl: "dividend"},
    { directive: [".double", "4294967296"]},
    { lbl: "mask_int"},
    { directive: [".long", "0"]},
    { directive: [".long", "0xFFFFFFFF"]},
    { lbl: "main"},
    { jmp: "after_fun" },
    { lbl: "the_fun" },
    { pushq: {literal: 10} },
    { popq: "rax" },
    { ret: "" },
    { lbl: "after_fun" },
    { call: "the_fun"},
    { pushq: "rax" },
    { popq: 0 },
    { cvtsi2sdq: [0, "xmm0"] },
    { divsd: [{relative: "dividend"}, "xmm0"]},
    { leaq: [{relative: "str_print"}, "rdi"]},
    { movq: [{literal: 1}, "rax"]},
    { call: "printf" },
    { movq: [{literal: 0}, "rax"]},
    { leave: "" },
    { ret: "" }   
  ])

  ir4 = translateIR3([
    { lbl: "the_fun" },
    { functionIntro: [1,2,3,4,5,6,7,8,9,10] },
    { pushq: {literal: 10} },
    { popq: "rax" },
    "return",
  ]);

  assertEquals(ir4, [
    { directive: [".global", "main"] },
    { lbl: "str_print"},
    { directive: [".string", "%lf\n"]},
    { lbl: "dividend"},
    { directive: [".double", "4294967296"]},
    { lbl: "mask_int"},
    { directive: [".long", "0"]},
    { directive: [".long", "0xFFFFFFFF"]},
    { lbl: "main"},
    { lbl: "the_fun" },
    { movq: ["rdi",1]},
    { movq: ["rsi",2]},
    { movq: ["rdx",3]},
    { movq: ["rcx",4]},
    { movq: ["r8",5]},
    { movq: ["r9",6]},
    { popq: 7},
    { popq: 8},
    { popq: 9},
    { popq: 10},
    { pushq: {literal:10}},
    { popq: "rax" },
    { ret: "" },
    { cvtsi2sdq: [0, "xmm0"] },
    { divsd: [{relative: "dividend"}, "xmm0"]},
    { leaq: [{relative: "str_print"}, "rdi"]},
    { movq: [{literal: 1}, "rax"]},
    { call: "printf" },
    { movq: [{literal: 0}, "rax"]},
    { leave: "" },
    { ret: "" }  
  ])
});


