import { CompIR0 } from "./CompIR0.ts";
import { translate as translateC0 } from "./CompIR0Translator.ts";
import { translate as translateC1 } from "./CompIR1Translator.ts";
import { translate as translateC2 } from "./CompIR2Translator.ts";
import { translate as translateC3 } from "./CompIR3Translator.ts";
import { translate as translateC4 } from "./CompIR4Translator.ts";
import { execute } from "./CompIr5Vm.ts";

export function compile(code: CompIR0) {
  const c1 = translateC0(code);
  const c2 = translateC1(c1);
  const c3 = translateC2(c2);
  const c4 = translateC3(c3);
  const c5 = translateC4(c4);
  return c5;
}
export function run(code: CompIR0) {
  const m = execute(compile(code));
  return m[0];
}
