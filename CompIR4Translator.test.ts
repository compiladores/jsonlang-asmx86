import { translate } from "./CompIR4Translator.ts";
import { assertEquals } from "https://deno.land/std@0.155.0/testing/asserts.ts";

Deno.test("CompIR4Translator", () => {
  const ir5 = translate([
    { lbl: "a" },
    { jmp: "a" },
    { jmp: "a" },
    { lbl: "b" },
    { jmp: "a" },
    { bz: "b" },
    { bnz: "d" },
    { jmp: "a" },
    { lbl: "d" },
    { jmp: "a" },
  ]);
  assertEquals(ir5, [
    { jmp: 0 },
    { jmp: -1 },
    { jmp: -2 },
    { bz: -1 },
    { bnz: 2 },
    { jmp: -5 },
    { jmp: -6 },
  ]);
});
