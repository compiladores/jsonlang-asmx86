import { CompIR4, argument_register } from "./CompIR4.ts";
import { CompIR3 } from "./CompIR3.ts";

export function translate(code: CompIR3[]): CompIR4[] {
   const ir4 = new Array<CompIR4>();

   // pushq   %rbp
   // movq    %rsp, %rbp
   // subq    $40, %rsp

   // TODO: PLACEHOLDER DE CANT VARIABLES
   ir4.push({enter: {literal: 8*100}}); //100 es el numero de variables de 64 bits que voy a usar

   for (const instruccion of code) {
      if (instruccion == "callBegin" || instruccion == "return" ||
         (typeof instruccion == "object" && ("callEnd" in instruccion || "functionIntro" in instruccion))) {

         if (instruccion == "callBegin") {
            //nada
         } else if (instruccion == "return") {
            ir4.push({ret: ""});

         } else if ("callEnd" in instruccion) {
            ir4.push({call: instruccion.callEnd})            

         } else if ("functionIntro" in instruccion) {
            const parametros_funcion = instruccion.functionIntro;

            const registers:argument_register[] = ["rdi", "rsi", "rdx", "rcx", "r8", "r9"];

            while (parametros_funcion.length > 0 && registers.length > 0) {
               const parameter = parametros_funcion.shift()
               const register = registers.shift();
               if (parameter == undefined || register == undefined) {
               throw new Error("PARAMETRO O REGISTRO ES UNDEFINED");       
               }

               ir4.push({movq: [register, parameter]})
            }

            // TODO: COMPLETAR CON LOS PARAMETROS EN STACK
            for (const ubicacion_destino of parametros_funcion) {
               ir4.push({popq: ubicacion_destino});
             }
            
         }         
      } else {
         ir4.push(instruccion);
      }
   }




   return ir4;
}
