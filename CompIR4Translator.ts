import { StatementIR4, operands } from "./CompIR4.ts";
import { CompIR5 } from "./CompIR5.ts";

export function translate(commands: StatementIR4[]): CompIR5 {
   let ir5 = "";

   for (const obj_instruccion of commands) {
      const inst = Object.entries(obj_instruccion)[0][0];
      const oper = Object.entries(obj_instruccion)[0][1];

      const string_operand = parse_operand(oper);
      
      if (inst == "directive") {
         if (oper[0] == ".string") { 
            ir5 += oper[0] + " \"" + oper[1].replaceAll("\n", "\\n") + "\"\n";

         } else {
            ir5 += oper[0] + " " + oper[1] + "\n";
         }


      } else if (inst == "lbl") {
         if (ir5.length != 0) ir5 += "\n"
         ir5 += string_operand + ":\n"

      } else {
         ir5 += "\t" + inst;

         if (string_operand.length != 0) {
            ir5 += "\t" + string_operand;
         }

         ir5 += "\n";
      }
      
   }

   console.log(ir5)
   return ir5;

   
}

function parse_operand(operand:operands):string {
   const registros: Set<string> = new Set(["r10", "r12",
   "r13", "r14", "r15", "r8", "r9", "rax", "rbp", "rbx",
   "rcx", "rdi", "rdx", "rip", "rsi", "rsp", "al", "bl",
   "cl", "xmm0", "xmm1", "xmm2"]);

   if (typeof operand == "string") {
      if (registros.has(operand)) 
         return "%" + operand;

      return operand;
   }

   if (typeof operand == "number") {
      const real_ubication = (operand+1)*-8;
      return String(real_ubication) + "(%rbp)";
   }

   if (typeof operand == "object") {
      if (operand instanceof Array) {
         let string= "";

         for (const individual_operand of operand) {
            string += parse_operand(individual_operand) + ", ";
         } 

         return string.slice(0, -2);
      }

      if ("literal" in operand) 
         return "$" + String(operand.literal);

      if ("relative" in operand) 
         return operand.relative + "(%rip)";
   }

   throw new Error("NO SE PUDO PARSEAR OPERDOR");
}



