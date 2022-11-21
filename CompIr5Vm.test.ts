import {
  assertObjectMatch,
} from "https://deno.land/std@0.155.0/testing/asserts.ts";
import { execute } from "./CompIr5Vm.ts";

Deno.test("play with vm", () => {
  const m = execute([
    { push: { literal: 1 } },
    { push: { literal: 3 } },
    { pop: 1 },
    { pop: 2 },

    { push: { literal: 5 } },
    { push: { literal: 3 } },
    "*",
    { pop: 3 },
    { push: { literal: 5 } },
    { push: { literal: 3 } },
    "-",
    { pop: 4 },
    { push: { literal: -10 } },
    { push: { literal: 2 } },
    "+",
    { push: { literal: 2 } },
    { bnz: 2 },
    { pop: 5 },
    { jmp: 3 },
    { push: { literal: 0 } },
    { pop: 1 },
    { jmp: 1 },
    { jmp: 1 },
  ]);
  assertObjectMatch(m, {
    1: 3,
    2: 1,
    3: 15,
    4: -2,
  });
});

Deno.test("pushes", () => {
  const m = execute([
    { push: { literal: 1 } },
    { push: { literal: 3 } },
    { pop: 11 },
    { pop: 12 },
  ]);
  assertObjectMatch(m, {
    11: 3,
    12: 1,
  });
});


Deno.test("pushes and operates", () => {
  const m = execute([
    { push: { literal: 5 } },
    { push: { literal: 3 } },
    "*",
    { pop: 3 },
  ]);
  assertObjectMatch(m, {
    3:15
  });
});