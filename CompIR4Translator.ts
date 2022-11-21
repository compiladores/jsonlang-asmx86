import { CompIR4 } from "./CompIR4.ts";
import { CompiIr5Command } from "./CompIR5.ts";

export function translate(commands: CompIR4[]): CompiIr5Command[] {
   const labels = new Map<string, number>();
   const ir5 = new Array<CompiIr5Command>(); 

   let real_index = 0;

   for (const instruccion of commands) {
      if (typeof instruccion == "object" && "lbl" in instruccion) {
         //es lbl
         labels.set(instruccion.lbl, real_index);
      } else {
         real_index++;
      }        
   }

   let current_instruction = -1;

   for (const instruccion of commands.filter(no_es_label)) {
      current_instruction++;
      if ((typeof instruccion == "object" && ("bz" in instruccion || "bnz" in instruccion || "jmp" in instruccion || "lbl" in instruccion))) {
         instruccion
         let ubicacion_label:(number|undefined) = undefined;
         if (typeof instruccion != "object") {
            throw new Error("¿?"); 
         }

         if ("bz" in instruccion) {
            ubicacion_label = labels.get(instruccion.bz);
            if (ubicacion_label == undefined)
               throw Error("Label unvalida");
            
            ir5.push({bz: ubicacion_label-current_instruction})

         } else if ("bnz" in instruccion) {
            ubicacion_label = labels.get(instruccion.bnz);
            if (ubicacion_label == undefined)
               throw Error("Label unvalida");

            ir5.push({bnz: ubicacion_label-current_instruction})

         } else if ("jmp" in instruccion) {
            ubicacion_label = labels.get(instruccion.jmp);
            if (ubicacion_label == undefined)
               throw Error("Label unvalida");

            ir5.push({jmp: ubicacion_label-current_instruction})
         }
      } else {
         ir5.push(instruccion);
      }
   }
   
   return ir5;
}

function no_es_label(inst4: CompIR4):boolean {
   return !(typeof inst4 == "object" && "lbl" in inst4);
}

