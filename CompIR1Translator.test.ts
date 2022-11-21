import { translate, Context } from "./CompIR1Translator.ts";
import { assert, assertEquals, assertExists, assertInstanceOf, assertNotEquals, assertObjectMatch, assertThrows} from "https://deno.land/std@0.155.0/testing/asserts.ts";


Deno.test("create nonexistent", () => {
    const c = new Context();
    assertEquals(c.createAndGetId("x"), 1);
});


Deno.test("variable 'out' siempre esta en la posicion 0, y en el contexto global", () => {
    let c = new Context();
    assertNotEquals(c.createAndGetId("a"), 0);

    c = new Context();
    c.createAndGetId("x")
    c.createAndGetId("y")
    c.createAndGetId("z")

    assertEquals(c.createAndGetId("out"), 0);
    c.enterBlock()
    assertThrows(() => {c.createAndGetId("out")})


    c = new Context();
    c.enterBlock()
    assertEquals(c.createAndGetId("out"), 0);
    c.exitBlock()

    assertThrows(() => {c.createAndGetId("out")})
    assertEquals(c.getId("out"), 0);

})


Deno.test("create nonexistent instructions", () => {
    const ir2 = translate([
        {declare: "a", value: 5},
    ])

    assert(typeof ir2[0] == "object" &&
            "value" in ir2[0] &&
             JSON.stringify(ir2[0].value) == '{"literal":5}')
})


Deno.test("get nonexistent crea la variable en scope global", () => {
    const c = new Context();
    
    c.enterBlock()
    const id_x_global = c.getId("x")

    c.exitBlock()
    assertThrows(() => c.createAndGetId("x"));
    assertEquals(c.getId("x"), id_x_global);

});


Deno.test("create existing", () => {
    const c = new Context();
    c.createAndGetId("x");
    assertThrows(() => c.createAndGetId("x"));
});


Deno.test("create and get equals for same variable", () => {
    const c = new Context();
    const id_x = c.createAndGetId("x");
    assertEquals(c.getId("x"), id_x);
    c.createAndGetId("y");
    assertEquals(c.getId("x"), id_x);
});


Deno.test("using blocks", () => {
    const c = new Context();
    const id_x_global = c.createAndGetId("x");

    c.enterBlock();

    assertEquals(c.getId("x"), id_x_global);    
    const id_x_1 = c.createAndGetId("x");
    assertThrows(() => c.createAndGetId("x"));
    assertEquals(c.getId("x"), id_x_1);

    c.enterBlock();

    assertEquals(c.getId("x"), id_x_1);
    c.exitBlock();
    assertEquals(c.getId("x"), id_x_1);
    c.exitBlock();
    assertEquals(c.getId("x"), id_x_global);

    assertThrows(() => c.exitBlock());
});


Deno.test("using functions", () => {
    const c = new Context();
    const x_0 = c.createAndGetId("x");
    const z_0 =c.createAndGetId("z");

    c.enterFunction();
    const x_1 = c.createAndGetId("x");
    const y_1 = c.createAndGetId("y");
    assertEquals(c.getId("x"), x_1);

    c.enterBlock();
    const _x_2 = c.createAndGetId("x");

    c.enterBlock();
    const x_3 = c.createAndGetId("x");

    c.enterBlock();
    const x_4 = c.createAndGetId("x");
    assertEquals(c.getId("x"), x_4);
    assertEquals(c.getId("y"), y_1);
    assertEquals(c.getId("z"), z_0);

    c.exitBlock();
    assertEquals(c.getId("x"), x_3);
    assertEquals(c.getId("y"), y_1);
    assertEquals(c.getId("z"), z_0);
    c.getId("z");

    c.exitFunction();
    assertEquals(c.getId("x"), x_0);
    assertEquals(c.getId("z"), z_0);
    assertNotEquals(c.getId("y"), y_1);
});


Deno.test("extra: salir de funcion 2 veces consecuntivas", () => {
    const c = new Context();
  
    c.createAndGetId("x");
    c.enterBlock();
      const x_1 = c.createAndGetId("x");
      c.enterFunction();
        c.createAndGetId("x");
        c.enterBlock()
          c.createAndGetId("x");
          c.enterBlock()
            const x_4 =c.createAndGetId("x");
            c.enterFunction();
              c.createAndGetId("x");
              c.enterBlock();
                c.enterBlock()
                  c.createAndGetId("x");
            c.exitFunction()
            assertEquals(c.getId("x"), x_4);
      c.exitFunction()
      assertEquals(c.getId("x"), x_1);
  assertThrows(() => c.exitFunction());
  
  });
  
Deno.test("extra: no se puede salir de bloque si siguiente scope es funcion", () => {
    const c = new Context();
    c.enterBlock();
    c.enterFunction();
    c.enterBlock();
    c.exitBlock();
    assertThrows(() => c.exitBlock());
});
  
Deno.test("extra: no se puede hacer un createAndGetId global, si un set creo la variable en cualquier scope", () => {
    const c = new Context();
    c.enterBlock();
    const x_0 = c.getId("x");
    const x_1 = c.createAndGetId("x");
    assertEquals(c.getId("x"), x_1);
    c.exitBlock();
    assertThrows(() => {c.createAndGetId("x")});
    assertEquals(c.getId("x"), x_0);
});
  
Deno.test("extra: variables se heredan al scope de funcion", () => {
    const c = new Context();
    const a_0 = c.getId("a");
    const b_0 = c.createAndGetId("b");
    c.enterFunction();
    assertEquals(c.getId("a"), a_0);
    assertEquals(c.getId("b"), b_0);
    c.exitFunction();
});
  
Deno.test("extra: puedo acceder a una variable del scope anterior, hasta que la variable es redeclarada en el scope actual", () => {
    const c = new Context();
    const a_0 = c.getId("a");
    c.enterBlock();
      assertEquals(c.getId("a"),a_0);
      c.getId("a")
      assertEquals(c.getId("a"), a_0);
      const a_1 = c.createAndGetId("a");
      assertEquals(c.getId("a"), a_1);
      c.getId("a");
      assertEquals(c.getId("a"), a_1);
    c.exitBlock()
    assertEquals(c.getId("a"), a_0);
});


Deno.test("extra: prueba funcion", () => {
    const ir2 = translate([
        {jmp: "l0",},
        {lbl: "inc",},
        {functionIntro: ["x"]},
        {return: {binop: "+", argl: "x", argr: 1}},
        "functionEnd",
        {lbl: "l0",},
        {declare: "x", value: 5},
        {set: "out", value: {
            call: "inc",
            args: [5],
          },
        },
    ])

    assertEquals(ir2, [
        {jmp: "l0",},
        {lbl: "inc",},
        {functionIntro: [1]},
        {return: {binop: "+", argl: 1, argr: {literal: 1}}},
        {lbl: "l0",},
        {set: 2, value: {literal: 5}},
        {set: 0, value: {
            call: "inc",
            args: [{literal:5}],
          },
        },
    ])
    

})