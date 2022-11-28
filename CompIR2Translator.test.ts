import { translate as translateIR2 } from "./CompIR2Translator.ts";
import { assertEquals } from "https://deno.land/std@0.155.0/testing/asserts.ts";

Deno.test("extra set literal, and set variable", () => {
    let ir3 = translateIR2([
        {set: 10, value: {literal: 1}}
    ])

    assertEquals(ir3, [
        {pushq: {literal: 1}},
        {popq: 10}
    ])

    ir3 = translateIR2([
        {set: 1, value: 2}
    ]);

    assertEquals(ir3, [
        {pushq: 2},
        {popq: 1}
    ])
});

Deno.test("extra set unop y binop", () => {
    let ir3 = translateIR2([
        {set:1, value: {unop: "-", arg: 2}}
    ])

    assertEquals(ir3, [
        {pushq: 2},
        {popq: "rax"},
        {negq: "rax"},
        {pushq: "rax"},
        {popq: 1}
    ]);
    
    ir3 = translateIR2([
        {set:1, value: {binop: "+", argl: {literal: 1}, argr: {
            binop: "-", argl: {literal: 6}, argr: 2
        }}}
    ])
    
    assertEquals(ir3, [
        {pushq: {literal: 1}},
        {pushq: {literal: 6}},
        {pushq: 2},
        {popq: "rbx"},
        {popq: "rax"},
        {subq: ["rbx", "rax"]},
        {pushq: "rax"},
        {popq: "rbx"},
        {popq: "rax"},
        {addq: ["rbx", "rax"]},
        {pushq: "rax"},
        {popq: 1}
    ])


    ir3 = translateIR2([    // a = (3-4)+("6"-2);
        {set:1, value: {binop: "+", argl: {binop: "-", argl: 3, argr: 4}, argr: {
            binop: "-", argl: {literal: 6}, argr: 2
        }}}
    ])
    
    assertEquals(ir3, [
        {pushq: 3},
        {pushq: 4},
        {popq: "rbx"},
        {popq: "rax"},
        {subq: ["rbx", "rax"]},
        {pushq: "rax"},
        {pushq: {literal: 6}},
        {pushq: 2},
        {popq: "rbx"},
        {popq: "rax"},
        {subq: ["rbx", "rax"]},
        {pushq: "rax"},
        {popq: "rbx"},
        {popq: "rax"},
        {addq: ["rbx", "rax"]},
        {pushq: "rax"},
        {popq: 1}
    ])
})


Deno.test("extra call as statment", () => {
    let ir3 = translateIR2([
        {call: "label2", args: []},
    ])

    assertEquals(ir3, [
        "callBegin",
        {callEnd: "label2"}
    ])

    ir3 = translateIR2([
        {call: "label", args: [{literal: 1}, {literal: 2}, 3]},
    ])

    assertEquals(ir3, [
        "callBegin",
        {pushq: {literal:1}},
        {popq: "rdi"},
        {pushq: {literal:2}},
        {popq: "rsi"},
        {pushq: 3},
        {popq: "rdx"},
        {callEnd: "label"},
    ])

    ir3 = translateIR2([
        {call: "label", args: [1,2,3,4,5,6,7,8,9,10,11,12]},
    ])

    assertEquals(ir3, [
        "callBegin",
        {pushq: 1},
        {popq: "rdi"},
        {pushq: 2},
        {popq: "rsi"},
        {pushq: 3},
        {popq: "rdx"},
        {pushq: 4},
        {popq: "rcx"},
        {pushq: 5},
        {popq: "r8"},
        {pushq: 6},
        {popq: "r9"},
        {pushq: 12},
        {pushq: 11},
        {pushq: 10},
        {pushq: 9},
        {pushq: 8},
        {pushq: 7},
        {callEnd: "label"},
    ])

})

//Que diferencia debería tener?
Deno.test("extra call as expr", () => {
    let ir3 = translateIR2([
        {set: 1, value: {call: "label", args: [{literal: 1}, {literal: 2}, 3]}},
    ])

    assertEquals(ir3, [
        "callBegin",
        {pushq: {literal:1}},
        {popq: "rdi"},
        {pushq: {literal:2}},
        {popq: "rsi"},
        {pushq: 3},
        {popq: "rdx"},
        {callEnd: "label"},
        {pushq: "rax"},
        {popq: 1}
    ])

    ir3 = translateIR2([
        {set: 1, value: {call: "label2", args: []}},
    ])

    assertEquals(ir3, [
        "callBegin",
        {callEnd: "label2"},
        {pushq: "rax"},
        {popq: 1}
    ])
})

Deno.test("extra return", () => {
    let ir3 = translateIR2([
        {return: 10}
    ])

    assertEquals(ir3, [
        {pushq: 10},
        {popq: "rax"},
        "return"
    ]);

    ir3 = translateIR2([
        {return: {binop: "+", argl: 1, argr: 2}}
    ]);

    assertEquals(ir3, [
        {pushq: 1},
        {pushq: 2},
        {popq: "rbx"},
        {popq: "rax"},
        {addq: ["rbx", "rax"]},
        {pushq: "rax"},
        {popq: "rax"},
        "return",
    ])

});


Deno.test("extra cmpq", () => {
    const ir3 = translateIR2([
        {cmpq: [{binop: "-", argl: 3, argr: 4}, {register: "rcx"}]} 
    ])

    assertEquals(ir3, [
        {pushq: 3},
        {pushq: 4},
        {popq: "rbx"},
        {popq: "rax"},
        {subq: ["rbx", "rax"]},
        {pushq: "rax"},

        {pushq: "rcx"},

        {popq: "rbx"},
        {popq: "rax"},
        {cmpq: ["rax", "rbx"]}        
    ])
})