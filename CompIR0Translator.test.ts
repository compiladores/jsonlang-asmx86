// stmt array --> for each traducir
// stmt if --> bz? bnz?
// stmt iterator --> ¿? averiguar
// stmt do --> parecido a while pero al reves

import { translate } from "./CompIR0Translator.ts";
import { assert, assertEquals, assertExists, assertInstanceOf, assertNotEquals, assertObjectMatch, assertThrows} from "https://deno.land/std@0.155.0/testing/asserts.ts";

Deno.test("extra IF", () => {
    let ir1 = translate([
        {if: [{cond: 5, then: {set: "hola", value: 10}}]}
    ]);

    

    //COMO HAGO?
    // si 1 verdadero
    // si 0 falso

    assertEquals(ir1, [
        "enterBlock",
        {cmpq: [0, 5]},
        {je: "l0"},
        {set: "hola", value: 10},
        {lbl: "l0"},
        "exitBlock"
    ])

    ir1 = translate([
        {if: [{cond: "x", then: {set: "hola", value: 10}}],
         else: {set:"hola", value: 20}}
    ])

    assertEquals(ir1, [
        "enterBlock",
        {cmpq: [0, "x"]},
        {je: "l0"},
        {set: "hola", value: 10},
        {jmp: "l1"},

        {lbl: "l0"},
        {set:"hola", value: 20},
        {lbl: "l1"},
        "exitBlock"
    ])

    ir1 = translate([
        {if: [
            {cond: 0, then: {set: "x", value: 0}},
            {cond: 1, then: {set: "x", value: 1}},
            {cond: 2, then: {set: "x", value: 2}},
            {cond: 3, then: {set: "x", value: 3}},
            
        ],
         else: {set:"x", value: 4}}
    ])

    assertEquals(ir1, [
        "enterBlock",
        {cmpq: [0, 0]},
        {je: "l0"},
        {set: "x", value: 0},
        {jmp: "l4"},
        {lbl: "l0"},

        {cmpq: [0, 1]},
        {je: "l1"},
        {set: "x", value: 1},
        {jmp: "l4"},
        {lbl: "l1"},

        {cmpq: [0, 2]},
        {je: "l2"},
        {set: "x", value: 2},
        {jmp: "l4"},
        {lbl: "l2"},

        {cmpq: [0, 3]},
        {je: "l3"},
        {set: "x", value: 3},
        {jmp: "l4"},
        {lbl: "l3"},

        {set: "x", value: 4},
        {lbl: "l4"},
        "exitBlock"
    ]);


    ir1 = translate([
        {if: [
            {cond: 0, then: {set: "x", value: 0}},
            {cond: 1, then: {set: "x", value: 1}},
            {cond: 2, then: {set: "x", value: 2}},
            {cond: 3, then: {set: "x", value: 3}},
            
        ]}
    ])

    assertEquals(ir1, [
        "enterBlock",
        {cmpq: [0, 0]},
        {je: "l0"},
        {set: "x", value: 0},
        {jmp: "l3"},
        {lbl: "l0"},

        {cmpq: [0, 1]},
        {je: "l1"},
        {set: "x", value: 1},
        {jmp: "l3"},
        {lbl: "l1"},

        {cmpq: [0, 2]},
        {je: "l2"},
        {set: "x", value: 2},
        {jmp: "l3"},
        {lbl: "l2"},

        {cmpq: [0, 3]},
        {je: "l3"},
        {set: "x", value: 3},
        {lbl: "l3"},

        "exitBlock"
    ]);
});


Deno.test("extra iterator", () => {
    let ir1 = translate([
        {
            iterator: "x",
            from: 0,
            to: 10,
            do: [{set: "a", value:"x"}]
        }
    ])

    assertEquals(ir1, [
        "enterBlock",
        {declare: "x", value: 0},

        {lbl: "l0"},

        {cmpq: [0, {binop: "<=", argl: "x", argr: 10}]},
        {je: "l1"},
        {set: "a", value:"x"},
        {set: "x", value: {binop:"+", argl:"x", argr: 1}},
        {jmp:"l0"},
        {lbl: "l1"},
        "exitBlock",
    ])

    ir1 = translate([
        {
            iterator: "x",
            from: 0,
            to: 20,
            step: 2,
            do: [{set: "a", value:"x"}]
        }
    ])

    assertEquals(ir1, [
        "enterBlock",
        {declare: "x", value: 0},
        {lbl: "l0"},
        {cmpq: [0, {binop: "<=", argl: "x", argr: 20}]},
        {je: "l1"},
        {set: "a", value:"x"},
        {set: "x", value: {binop:"+", argl:"x", argr: 2}},
        {jmp:"l0"},
        {lbl: "l1"},
        "exitBlock"
    ])

    ir1 = translate([
        {
            iterator: "y",
            from: 10,
            to: -10,
            step: -1,
            do: [{set: "a", value:"y"}]
        }
    ])

    assertEquals(ir1, [
        "enterBlock",
        {declare: "y", value: 10},
        {lbl: "l0"},
        {cmpq: [0,{binop: ">=", argl: "y", argr: -10}]},
        {je: "l1"},
        {set: "a", value:"y"},
        {set: "y", value: {binop:"+", argl:"y", argr: -1}},
        {jmp:"l0"},
        {lbl: "l1"},
        "exitBlock"
    ])
});

Deno.test("extra until", () => {
    const ir1 = translate([
        {do: [{set: "b", value: 0}], until: "x"}
    ])

    assertEquals(ir1, [
        "enterBlock",
        {set: "b", value: 0},
        { lbl: "l0" },
        { cmpq: [0,{unop: "!", arg: "x"}] },
        { je: "l1" },
        {set: "b", value: 0},
        { jmp: "l0" },
        { lbl: "l1" },
        "exitBlock"
    ])
})


Deno.test("extra array (bloque)", () => {
    const ir1 = translate([
        {set: "x", value: 0},
        [
           {set: "x", value: 1},
           {declare: "x", value:10},
           {set: "x", value: 20},
        ],

        {set: "x", value: 3}
    ]);


    assertEquals(ir1,[
        {set: "x", value: 0},
        
        "enterBlock",
        {set: "x", value: 1},
        {declare: "x", value:10},
        {set: "x", value: 20},
        "exitBlock",
        
        {set: "x", value: 3}
    ])
})

