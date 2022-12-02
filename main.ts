import { CompIR0 } from "./CompIR0.ts";
import { translate as translateC0 } from "./CompIR0Translator.ts";
import { translate as translateC1 } from "./CompIR1Translator.ts";
import { translate as translateC2 } from "./CompIR2Translator.ts";
import { translate as translateC3 } from "./CompIR3Translator.ts";
import { translate as translateC4 } from "./CompIR4Translator.ts";
import { CompIR5 } from "./CompIR5.ts";

export function compile(code: CompIR0) {
  const c1 = translateC0(code);
  const c2 = translateC1(c1);
  const c3 = translateC2(c2);
  const c4 = translateC3(c3);
  const c5 = translateC4(c4);
  return c5;
}
export async function run(code: CompIR0): Promise<number> {
  const asm = compile(code);
  
  await generate_asm_file(asm);

  const resultado = await assemble_and_run()

  return (resultado);
}

export async function generate_asm_file(code: CompIR5) {
  await Deno.writeTextFile("./programa.s", code.toString())
}


export async function assemble_and_run():Promise<number> {
  //USAR FORK; O PROCESO HIJO


  const gcc = Deno.run({cmd: ["gcc", "./programa.s", "-o", "a.out"], stdout: "piped", stderr: "piped"});
  
  const [status_gcc, _, stderr_gcc] = await Promise.all([
    gcc.status(),
    gcc.output(),
    gcc.stderrOutput()
  ]);
  gcc.close();


  if (!status_gcc.success) {
    const errorString = new TextDecoder().decode(stderr_gcc);
    throw new Error("Error ensamblado GCC:\n" + errorString);
  }

  const program = Deno.run({cmd: ["./a.out"], stdout:"piped", stderr: "piped"});
  const [status_program, stdout_program, stderr_program] = await Promise.all([
    program.status(),
    program.output(),
    program.stderrOutput()
  ]);
  program.close();

  


  if (!status_program.success) {
    const errorString = new TextDecoder().decode(stderr_program);
    throw new Error("Error ejecucion programa:\n" + errorString);
  }

  const decodificado = new TextDecoder().decode(stdout_program);

  return parseInt(decodificado);
}