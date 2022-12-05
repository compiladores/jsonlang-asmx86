# Implementacion de backend JSONLang a target ASM x86_64

## Quickstart, editor, dependencias

```
make setup
```

Instala `deno` 1.26.0 en la carpeta raíz del repositorio, y crea una carpeta
`.vscode` con la configuración recomendada de vscode.

Se debe tener instalado GCC para poder realizar el ensamblado y linkeo del ASM generado.

Para ejecutar la suit de tests, se tiene que ejecutar `./deno test`

## Arquitectura general del proyecto.

Se utilizo una estructura similar al del Lab6, donde el programa se traduce 5 veces. En cada traducción se resuelve un problema.

1. CompIR0Translator: Elimina ("desdobla"/"despliega"/"unfolds") estructuras de control
2. CompIR1Translator: Elimina variables
3. CompIR2Translator: Elimina expresiones, introduce registros ___(WIP)___
4. CompIR3Translator: Elimina funciones, agrega declaracion main, printeo de variable `out`
5. CompIR4Translator: Convierte array de objetos a string a escribir en programa.s

Decidí eliminar el paso de eliminar las etiquetas, porque me pareció que es una parte integral de la estructura de un archivo de Assembly.

## Documentación

### __Herramienta usada para la investigacion__
[Godbolt](gcc.godbolt.org) que permite escribir un programa en codigo C, y ver cual es el resultado en assembler. Permite ver además que instrucciones Assembler representan cada instruccion del codigo C.

### __Registros__

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


### __Adressing modes__
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


### __Implementacion operadores__

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

> #### Fuente:
> [Intel® 64 and IA-32 Architectures Developer's Manual](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)

### __Uso de PRINTF (y otras funciones cantidad de parametros variable)__
Para envias parametros float, o double, se tienen que usar los registros `%xmm0 - %xmm7`. Pero antes de llamar la funcion, se debe indicar la cantidad de registros xmm usado, en el registro `%al` (osea `%rax`)
Pero al parecer, en printf@PLT, con indicar que existen registros de punto flotante (con un numero distinto de 0) alcanza.

> #### Fuente: 
> [System V Application Binary Interface AMD64](https://raw.githubusercontent.com/wiki/hjl-tools/x86-psABI/x86-64-psABI-1.0.pdf)



### __¿Cómo se traduce el if a esta plataforma o VM?__
Para implementar el if en x86_64, se utilizan las flags (siendo estas: overflow, below, equal, sign, parity) y las instrucciones de salto condicional.

Para esto, lo que hago, esejecutar una instruccion que me setee los flags correspondientes a la condicion (en el caso del tp mio, realizo la operacion necesaria, y luego hago un cmpq con 0; y con eso tengo las flags seteadas, para juego, realizar un salto condicional. 
Como 0 es falso, si el flag de equal esta seteado (que el valor metido es igual a 0) hago un salto hacia afuera del if, para "saltearlo", y si el flag no esta seteado, quiere decir que la condicion era verdadera, por lo que continuo la ejecución dentro del bloque del if.

Por lo que el siguiente codigo:
```c
//antes if
if (5) {
    // adentro if
}
//afuera if
```

Simplificandolo, se convierte en algo como:
```as
//antes if
    cmpq    $0, $5 //Se setea el flag equal a 0
    je      despues_if
//adentro if
despues_if:
//afuera if
```

Tambien, en vez de hacer una comparacion con 0; se podría tomar directamente la comparacion que se realiza dentro de la expresion del if, y decidir cual de todos los saltos condicionales realizar, de manera de ahorrar instrucciones, pero resultaría mucho más complejo tener en cuenta todas las combinaciones posibles.

> #### Fuente:
> https://en.wikibooks.org/wiki/X86_Disassembly/Branches



### __¿Cómo se traduce el while a esta plataforma o VM?__

Para realizar el while, se utiliza una tecnica similar al IF, solo que al final del "bloque del if" se encuentra un salto obligatorio al inicio. 
De esta manera, primero se computa la expresion condicional, luego se realiza el cmpq, y finalmente se hace un salto hacia afuera del while, si la condicion es falsa. Si la condicion es verdadera, se continua la ejecucion del codigo dentro del while, hasta que se llega al final, donde hay un salto obligatorio, que te lleva hacia la instruccion que analiza la expresion condicional.

Por lo que el siguiente codigo
```c
//antes while
while (x==5) {
    //adentro while
}
//despues while
```

se convierte en:
```as
//antes while
inicio_while:
    cmpq    x, $5
    jne     afuera_while    //si no son iguales se salta afuera
    //adentro while
    jmp     inicio_while

afuera_while:
//despues while
```

> #### Fuente
> https://en.wikibooks.org/wiki/X86_Disassembly/Loops


### __¿Cómo se traduce call a esta plataforma o VM?__
Para realizar una llamada en x86_64, se debe tener en cuenta el sistema operativo para el que estamos programando. Esto es, porque si bien se utiliza la misma instruccion para realizar la llamada, `call`, el estandar para pasar parametros cambia.

En el caso de Linux, se pasan los primeros 6 parametros en orden por los siguientes registros: `%rdi`, `%rsi`, `%rdx`, `%rcx`, `%r8`, `%r9`. y el resto de los parametros se pasan por el stack de manera inversa (osea, que la funcion pueda popear el 7mo parametro, luego el 8vo, etc.) En el caso de tener que pasar como parametro numeros flotantes, estos se pasan de manera similar a los enteros. Pasandose los primeros 8 argumentos flotantes por los registros `%xmm0` hasta `%xmm7`, y el resto de los parametros flotantes comparten el stack con los enteros.

Existe un caso especial, que es el de las funciones con cantidad variable de parametros. En este caso, se debe tambien pasar en el registro `%al` (los 4 bits más bajos del registro `%rax`) la cantidad de parametros flotantes, pasados por los registros `%xmm0-7`.

Tambien, antes de realizar la llamada a la funcion, hay que tener en cuenta que esta funcion puede sobreescribir alguno de los registros que estemos usando.
Esto se puede ver en la [tabla de registros](#registros), en la columna de callee-saved. Estos registros si son guardados por la *"funcion hija"*, pero para el resto de registros, es responsabilidad de la *"funcion padre"* almacenar en el stack (o en otros registros) los valores que no tienen que ser sobreescritos.

En el caso de llamar a una funcion externa, el stack pointer debe estar alineado a 16 bytes. En el caso de funciones internas, sería correcto si se quisiera seguir los lineamientos ABI, pero no resulta necesario para su ejecución.

> #### Fuente: 
> http://6.s081.scripts.mit.edu/sp18/x86-64-architecture-guide.html
> [System V Application Binary Interface AMD64](https://raw.githubusercontent.com/wiki/hjl-tools/x86-psABI/x86-64-psABI-1.0.pdf)



### __¿Cómo se traduce return a esta plataforma o VM?__
El return de una funcion, se hace de igual manera independientemente del sistema operativo.
Lo primero que se tiene que hacer, es restaurar los registros callee-saved que almacenamos en el stack, para que la *"funcion padre"* los tenga de vuelta.
Una vez hicimos esto, tenemos que almacenar en el registro "%rax" el valor de retorno de la funcion, y luego, podemos utilizar la instrucción `ret`. Esta instrucción ya se ocupa de 
volver a la ultima ubicacion donde se realizó un `call`.

> #### Fuente: 
> http://6.s081.scripts.mit.edu/sp18/x86-64-architecture-guide.html
> [System V Application Binary Interface AMD64](https://raw.githubusercontent.com/wiki/hjl-tools/x86-psABI/x86-64-psABI-1.0.pdf)


### __¿Cómo se traduce DeclarationStatement (declaración de funciones) a esta plataforma o VM?__
La declaracion de funcion es simplemente una etiqueta que indica el inicio de la funicion. Luego, tambien, si la funcion contiene parametros, estos parametros deben ser movidos a sus ubicaciones de memoria dentro de la funcion. Esto lo hago con la instruccion `movq`, en el caso de los parametros pasados por registro; y con un `popq` para el resto de parametros.
Luego se puede realizare la tarea que necesita realizar la funcion, y por ultimo, poner el return como se indicó anteriormente.
Hay que tener en cuenta que si se va a reemplazar el valor de un registro callee-saved, hay que guardar su contenido y restaurarlo antes de llegar al final de la función.

Tambien, al la hora de crear una función, si se quisiera aislar el stack respecto a la *"funcion padre"*, y poder hacer crecer y achicar dinamicamente el stack, se pueden usar las instrucciónes `enter` y `leave`.

A `enter` se le pasa la cantidad de bytes a reservar (y tambien se le puede pasar el nivel de profundidad de funcion, para acceder al as variables de niveles inferiores; pero resulta en codigo mucho más complejo, y no es usado en la mayoría de lenguajes).
Lo que hace la instruccion es pushear el actual _frame pointer_, y luego asignarle el actual _stack pointer_. Si se le pasa una cantidad de bytes a reservar, se le resta ese valor al _stack pointer_, para que las proximas instrucciones de `push` y `pop` operen luego de las variables locales. Esta instruccion se usa al inicio de la funcion, aunque los compiladores suelen usar la version con `push`, `mov`, y `sub` ya que pueden realizarse en menos ciclos del cpu, aunque ocupen más espacio en el programa. 

`leave` no recibe ningun parametro, y simplemente mueve el _stack pointer_ al _frame pointer_ y popea el anterior _frame pointer_ y lo restaura en el registro. Esta instruccion es usada antes de la instruccion `ret` para volver a la _funcion padre_

> #### Fuente:
> http://6.s081.scripts.mit.edu/sp18/x86-64-architecture-guide.html
> [System V Application Binary Interface AMD64](https://raw.githubusercontent.com/wiki/hjl-tools/x86-psABI/x86-64-psABI-1.0.pdf)


### __¿Cómo se traducen las expresiones a esta plataforma o VM?__

#### __- Variables Globales__
En x86_64, las variables globales, se almacenan en etiquetas dentro del codigo assembler del programa, y se utilizan usandolas como direccion relativa a la instruccion actual. Suponiendo una variable global `a`, que tiene de contenido el numero 10 (en especifico, mi imeplementacion almacena todos los numeros como enteros con signo de 64 bits), el codigo assembler lo representaía como:
```as
var_a: .quad 10
```
Y si quisiera utilizar este valor, o modificarlo, accedo a el con la expresion `var_a(%rip)`.

#### __- Variables Locales__
Para utilizar las variables locales, primero tengo que reservarlas moviendo el _stack pointer_. Esto se puede hacer con la instrucción `enter`, como explicado en la [declaracion de funciones](#cómo-se-traduce-declarationstatement-declaración-de-funciones-a-esta-plataforma-o-vm).
Para utilizar esta variable, simplemente tengo que tener la posicion en la que se encuentra respecto al _frame pointer_ (`%rbp`). Hay que tener en cuenta que como el stack crece para direcciones de memoria menores, la primera variable local no se encuentra en la direccion del _frame pointer_, sino que se encuentra n bytes para abajo (segun el tamaño del valor).
En el caso de mi implementacion, como todos los numero ocupan 64bits (8bytes), la primera variable se encuentra en `-8(%rbp)`, la segunda en `-16(%rbp)` y así sucesivamente.

### __- Numeros literales__
La arquitectura permite el uso de numeros literales en las operaciones. Sin embargo, las instrucciones de operaciones de _x86_64_ almacenan el resultado en el primer valor de la operacion (que es el segundo valor en la instruccion _x86_64_). Por lo que unicamente se puede utilizar un valor literal por operacion. En caso de que existan 2 numeros literales en una operacion (o uno solo en una operacion unitaria) el numero debe ser precalculado e insertar el resultado en el codigo assembler, o insertar los valores literales en registros, y luego hacer la operacion.

### __- Registros__
Como se muestra en el [cuadro de registros](#--registros) esta arquitectura posee varios registros que pueden usarse para acelerar el acceso a variables, ya que es una memoria mucho más rapida que la RAM.
Pero para hacer un uso apropiado de los registros, se debería hacer un analisis mas a fondo del AST para poder elegir cuales variables asignar a registros, en base a su uso, por lo que esta implementacion utiliza registros unicamente para hacer calculos necesarios.

### __- Operaciones__
Para realizar las operaciones, se usan las instrucciones especificadas en el [cuadro de implementacion de operadores](#implementacion-operadores).
En el caso de operaciones anidadas, se podría hacer uso de los distintos registros, pero llevaría un analisis más complejo. Por lo que para mi implementacion, decidí hacer uso del Stack, para almacenar los valores calculados. Recursivamente voy traduciendo el argumento izquierdo y luego derecho.
En el caso base de encontrarme con una variable, registro, o literal, este valor lo pusheo al stack.
Luego, en los casos no bases, popeo un valor al registro B, luego al registro A; y el resultado (que esta en el registro A) lo pusheo de nuevo al stack. Y así sucesivamente hasta la operacion principal.


