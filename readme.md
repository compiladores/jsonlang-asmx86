# Implementacion de backend JSONLang a target ASM x86_64

Compilador y VM de JsonLang

Para más detalles, visitar
[compiladores.github.io](https://compiladores.github.io).

## Quickstart, editor, dependencias

```
make setup
```

Instala `deno` 1.26.0 en la carpeta raíz del repositorio, y crea una carpeta
`.vscode` con la configuración recomendada de vscode.

Se debe tener instalado GCC para poder realizar el ensamblado y linkeo del ASM generado.

### Cómo hacer el laboratorio

Completar la implementación de `main.ts` de manera que pasen todos los tests
incluidos.

### Arquitectura general del proyecto.

Se utilizó una arquitectura más bien funcional, donde el programa se traduce 5 veces. En cada traducción se resuelve un problema.

1. CompIR0Translator: Elimina ("desdobla"/"despliega"/"unfolds") estructuras de control
2. CompIR1Translator: Elimina variables
3. CompIR2Translator: Elimina expresiones
4. CompIR3Translator: Elimina funciones
5. CompIR4Translator: Elimina labels

Los algoritmos que debe seguir cada etapa de la traducción se detallan en clase. Los algoritmos aplicados por `CompIR0Translator` y `CompIR1Translator` son similares a los que aplica el intérprete.

### Herramientas
- Codigo C a Assembly x86_64
https://gcc.godbolt.org/

## Documentación

### Registros

Los registros XMM son usados para almacenar y operar numeros de punto flotante.

Callee-Saved, significa que el registro tiene que ser preservado su estado por la funcion que fue llamada (la funcion "hija")

| Registros        | Proposito           | Callee-Saved | aclaraciones                            |
| ---------------- | ------------------- | ------------ | --------------------------------------- |
| `%rax`           | return value        | no           | Acumulador (extendido por `%rdx`)       |
| `%rbx`           | general             | si           | Base                                    |
| `%rcx`           | 4to argumento       | no           | Contador                                |
| `%rdx`           | 3er argumento       | no           | Data                                    |
| `%rsp`           | stack pointer       | si           | Crece hacia abajo                       |
| `%rbp`           | base pointer        | si           | (usado para stack frames)               |
| `%rsi`           | 2do argumento       | no           | Source index for string operations      |
| `%rdi`           | 1er argumento       | no           | Destination index for string operations |
| `%r8`            | 5to argumento       | no           |                                         |
| `%r9`            | 6to argumento       | no           |                                         |
| `%r10`           | general             | no           |                                         |
| `%r11`           | usado para linkear  | no           |                                         |
| `%r12`-`%r15`    | general             | si           |                                         |
| `%rip`           | instruction pointer | NO MODIFICAR | para referenciar etiquetas              |
| `%xmm0`          | valor retorno       | no           | (extendido por `%xmm1`)                 |
| `%xmm0`-`%xmm7`  | 1do-8vo argumentos  | no           |                                         |
| `%xmm8`-`%xmm15` | para punto flotante | no           |                                         |

> #### Fuentes:
> - http://6.s081.scripts.mit.edu/sp18/x86-64-architecture-guide.html
> - https://wiki.osdev.org/CPU_Registers_x86-64
> - https://www.cs.oberlin.edu/~bob/cs331/Notes%20on%20x86-64%20Assembly%20Language.pdf
> - https://en.wikipedia.org/wiki/X86_calling_conventions#System_V_AMD64_ABI


### Adressing modes
`section:disp(base, index, scale)` = `section:[base + index*scale + disp]`
where `base` and `index` are the optional 64-bit `base` and `index` registers, `disp` is the optional displacement, and scale, taking the values 1, 2, 4, and 8, multiplies index to calculate the address of the operand. If no scale is specified, scale is taken to be 1.
Section specifies the optional section register for the memory operand, and may override the default section register (NO USADO EN x86_64);

`-4(%ebp)`: base is `%ebp`, disp is `-4`

The x86-64 architecture adds an RIP (instruction pointer relative) addressing. This addressing mode is specified by using ‘rip’ as a base register. Only constant offsets are valid. For example:

`1234(%rip)` = `[rip + 1234]`
Points to the address 1234 bytes past the end of the current instruction.

`symbol(%rip)` Intel: `[rip + symbol]`
Points to the symbol in RIP relative way, this is shorter than the default absolute addressing.

Todos los numeros son bytes.

> #### Fuente:
> - https://sourceware.org/binutils/docs-2.39/as.html#i386_002dMemory


### Implementacion operadores

| operador  | long             | double               | notas                           |
| --------- | ---------------- | -------------------- | ------------------------------- |
| "+"       | addq             | addsd                |                                 |
| "-"       | subq             | subsd                |                                 |
| "*"       | imulq            | mulsd                |                                 |
| "/" int   | cqto(cqo);idivq  | NO                   | rdx:rax/reg; rax:cociente       | //Tengo que convertir entero a flotante para div exacta |
| "/" float | NO               | divsd                | hace division exacta            |
| "^"       | call pow?        | call pow?            | //NO ES IMPORTANTE PARA MATERIA |
| "%"       | cqto(cqo);idivq  | NO NATIVO            | rdx:rax/reg; rdx:resto          |
| "&"       | andq             | ¿andpd?              | usa packed floats??             |
| "\|"      | orq              | ¿orpd?               | usa packed floats??             |
| ">>"      | sarq             | NO NATIVO            | %r >> imm8/%cl                  |
| "<<"      | salq             | NO NATIVO            | %r \<\< imm8/%cl                |
| "<"       | cmpq;set*cc*     | comisd;set*cc*       | pagina 1329                     |
| "<="      | cmpq;set*cc*     | comisd;set*cc*       | pagina 1329                     |
| ">"       | cmpq;set*cc*     | comisd;set*cc*       | pagina 1329                     |
| ">="      | cmpq;set*cc*     | comisd;set*cc*       | pagina 1329                     |
| "=="      | cmpq;set*cc*     | comisd;set*cc*       | pagina 1329                     |
| "~="      | cmpq;set*cc*     | comisd;set*cc*       | pagina 1329                     |
| "and"     | cmpq;je;cmpq;je  | comisd;je;comisd;je  |
| "or"      | cmpq;jne;cmpq;je | comids;jne;comisd;je |
| "neg"     | negq             | xorpd¿?              | ver en godbolt.net              |
| "!"       |                  |                      | if equal 0; return 1; return 0; |
| "~"       |                  |                      | bitwise not                     |


### Uso de PRINTF (y otras funciones cantidad de parametros variable)
Para envias parametros float, o double, se tienen que usar los registros `%xmm0 - %xmm7`. Pero antes de llamar la funcion, se debe indicar la cantidad de registros xmm usado, en el registro `%al` (osea `%rax`)
Pero al parecer, en printf@PLT, con indicar que existen registros de punto flotante (con un numero distinto de 0) alcanza.

> #### Fuente: 
> https://refspecs.linuxbase.org/elf/x86_64-abi-0.99.pdf



### ¿Cómo se traduce el if a esta plataforma o VM?
### ¿Cómo se traduce el while a esta plataforma o VM?
### ¿Cómo se traduce call a esta plataforma o VM?
### ¿Cómo se traduce return a esta plataforma o VM?
### ¿Cómo se traduce DeclarationStatement (declaración de funciones) a esta plataforma o VM?
### ¿Cómo se traducen las expresiones a esta plataforma o VM?
#### Listar él o los links que resultaron más útiles para responder esas preguntas.