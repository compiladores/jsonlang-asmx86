import { CompIR4 } from "./CompIR4.ts";
import { CompIR3 } from "./CompIR3.ts";

export function translate(code: CompIR3[]): CompIR4[] {
   const ir4 = new Array<CompIR4>();

   ir4.push({push: {literal: 0}})
   ir4.push({pop: -3});

   for (const instruccion of code) {
      if (instruccion == "callBegin" || instruccion == "return" ||
         (typeof instruccion == "object" && ("callEnd" in instruccion || "functionIntro" in instruccion))) {

         if (instruccion == "callBegin") {
            ir4.push({push: -3});

         } else if (instruccion == "return") {
            ir4.push({pop: -2}) //Almaceno valor de retorno en -2
            
            
            ir4.push({push: -3});
            ir4.push({pop: "pc"});

         } else if ("callEnd" in instruccion) {
            ir4.push({push: "pc"})
            ir4.push({push: {literal: 5}})
            ir4.push("+")
            ir4.push({pop: -3})
            ir4.push({jmp: instruccion.callEnd});
            ir4.push({pop: -3})

            //Solo se tiene que pushear si es expression
            // ir4.push({push: -2})
            

         } else if ("functionIntro" in instruccion) {
            const parametros_funcion = instruccion.functionIntro;
            for (const parametro of parametros_funcion) {
               ir4.push({pop: parametro});
            }
            
         }         
      } else {
         ir4.push(instruccion);
      }
   }




   return ir4;
}
