import { translate as translateIR2 } from "./CompIR2Translator.ts";
import { assertEquals } from "https://deno.land/std@0.155.0/testing/asserts.ts";

Deno.test("extra push expr", () => {
    let ir3 = translateIR2([
        {push: {unop: "-", arg: 10}}
    ])

    assertEquals(ir3, [
        {push: 10},
        "neg",
    ]);
    
    ir3 = translateIR2([
        {push: {binop: "+", argl: {literal: 1}, argr: {
            binop: "/", argl: {literal: 6}, argr: {literal: 2}
        }}}
    ])
    
    assertEquals(ir3, [
        {push: {literal:2}},
        {push: {literal:6}},
        "/",
        {push: {literal:1}},
        "+"
    ])
})

Deno.test("extra set", () => {
    let ir3 = translateIR2([
        {set: 10, value: {literal: 1}}
    ])

    assertEquals(ir3, [
        {push: {literal: 1}},
        {pop: 10}
    ])

    ir3 = translateIR2([
        {set: 1, value: {
            binop: "/", argl: {literal: 6}, argr: {literal: 2}
        }}
    ]);

    assertEquals(ir3, [
        {push: {literal: 2}},
        {push: {literal: 6}},
        "/",
        {pop: 1}

    ])
});

Deno.test("extra call as statment", () => {
    let ir3 = translateIR2([
        {call: "label", args: [{literal: 1}, {literal: 2}, 3]},
    ])

    assertEquals(ir3, [
        "callBegin",
        {push: 3},
        {push: {literal:2}},
        {push: {literal:1}},
        {callEnd: "label"},
    ])

    ir3 = translateIR2([
        {call: "label2", args: []},
    ])

    assertEquals(ir3, [
        "callBegin",
        {callEnd: "label2"}
    ])
})

//Que diferencia debería tener?
Deno.test("extra call as expr", () => {
    let ir3 = translateIR2([
        {push: {call: "label", args: [{literal: 1}, {literal: 2}, 3]}},
    ])

    assertEquals(ir3, [
        "callBegin",
        {push: 3},
        {push: {literal:2}},
        {push: {literal:1}},
        {callEnd: "label"},
        {push: -2}
    ])

    ir3 = translateIR2([
        {push :{call: "label2", args: []}},
    ])

    assertEquals(ir3, [
        "callBegin",
        {callEnd: "label2"},
        {push: -2}
    ])
})

Deno.test("extra return", () => {
    let ir3 = translateIR2([
        {return: 10}
    ])

    assertEquals(ir3, [
        {push: 10},
        "return"
    ]);

    ir3 = translateIR2([
        {return: {binop: "+", argl: 1, argr: 2}}
    ]);

    assertEquals(ir3, [
        {push: 2},
        {push: 1},
        "+",
        "return",
    ])

});