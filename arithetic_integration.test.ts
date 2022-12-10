import { run } from "./main.ts";
import {
  assertEquals,
} from "https://deno.land/std@0.155.0/testing/asserts.ts";

Deno.test("+", async () => {
  let c = await run([{
    "set": "out",
    "value": {binop: "+", argl: 10, argr: 20}
  }]);
  assertEquals(c, 30);

  c = await run([{
    "set": "out",
    "value": {binop: "+", argl: -10, argr: -20}
  }]);
  assertEquals(c, -30);

  c = await run([{
    "set": "out",
    "value": {binop: "+", argl: 0, argr: 10}
  }]);
  assertEquals(c, 10);

  c = await run([{
    "set": "out",
    "value": {binop: "+", argl: 0, argr: 0}
  }]);
  assertEquals(c, 0);
});



Deno.test("-", async () => {
  let c = await run([{
    "set": "out",
    "value": {binop: "-", argl: 10, argr: 20}
  }]);
  assertEquals(c, -10);

    
  c = await run([{
    "set": "out",
    "value": {binop: "-", argl: 20, argr: 10}
  }]);
  assertEquals(c, 10);

  c = await run([{
    "set": "out",
    "value": {binop: "-", argl: 10, argr: 0}
  }]);
  assertEquals(c, 10);

  c = await run([{
    "set": "out",
    "value": {binop: "-", argl: 0, argr: 0}
  }]);
  assertEquals(c, 0);
});



  Deno.test("*", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: "*", argl: 10, argr: 20}
    }]);
    assertEquals(c, 200);

    c = await run([{
      "set": "out",
      "value": {binop: "*", argl: -10, argr: 20}
    }]);
    assertEquals(c, -200);

    c = await run([{
      "set": "out",
      "value": {binop: "*", argl: 15, argr: 1}
    }]);
    assertEquals(c, 15);

    c = await run([{
      "set": "out",
      "value": {binop: "*", argl: 50, argr: 0}
    }]);
    assertEquals(c, 0);
  });



  Deno.test("/", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: "/", argl: 100, argr: 50}
    }]);
    assertEquals(c, 2);

    
    c = await run([{
      "set": "out",
      "value": {binop: "/", argl: 0, argr: 100}
    }]);
    assertEquals(c, 0);

    
    c = await run([{
      "set": "out",
      "value": {binop: "/", argl: -100, argr: 20}
    }]);
    assertEquals(c, -5);

    c = await run([{
      "set": "out",
      "value": {binop: "/", argl: 354, argr: 1}
    }]);
    assertEquals(c, 354);
  });



  Deno.test("^", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: "^", argl: 10, argr: 2}
    }]);
    assertEquals(c, 100);

    c = await run([{
      "set": "out",
      "value": {binop: "^", argl: 2, argr: 8}
    }]);
    assertEquals(c, 256);

    c = await run([{
      "set": "out",
      "value": {binop: "^", argl: 10, argr: 1}
    }]);
    assertEquals(c, 10);

    c = await run([{
      "set": "out",
      "value": {binop: "^", argl: 17, argr: 0}
    }]);
    assertEquals(c, 1);
  });



  Deno.test("%", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: "%", argl: 17, argr: 2}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: "%", argl: 100, argr: 20}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: "%", argl: 17, argr: 10}
    }]);
    assertEquals(c, 7);
  });



  Deno.test("&", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: "&", argl: 12, argr: 8}
    }]);
    assertEquals(c, 8);

    c = await run([{
      "set": "out",
      "value": {binop: "&", argl: 0, argr: 1}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: "&", argl: -10, argr: 54}
    }]);
    assertEquals(c, 54);

    c = await run([{
      "set": "out",
      "value": {binop: "&", argl: 246, argr: 236}
    }]);
    assertEquals(c, 228);

    
    c = await run([{
      "set": "out",
      "value": {binop: "&", argl: 10, argr: 38}
    }]);
    assertEquals(c, 2);
  });



  Deno.test("|", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: "|", argl: 4, argr: 8}
    }]);
    assertEquals(c, 12);

    c = await run([{
      "set": "out",
      "value": {binop: "|", argl: 0, argr: 1}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: "|", argl: -10, argr: 1}
    }]);
    assertEquals(c, -9);

    c = await run([{
      "set": "out",
      "value": {binop: "|", argl: 246, argr: 236}
    }]);
    assertEquals(c, 254);

    
    c = await run([{
      "set": "out",
      "value": {binop: "|", argl: 10, argr: 38}
    }]);
    assertEquals(c, 46);
  });



  Deno.test(">>", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: ">>", argl: 54, argr: 2}
    }]);
    assertEquals(c, 13);

    c = await run([{
      "set": "out",
      "value": {binop: ">>", argl: 2, argr: 7}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: ">>", argl: 1, argr: 1}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: ">>", argl: 105, argr: 0}
    }]);
    assertEquals(c, 105);

    
    c = await run([{
      "set": "out",
      "value": {binop: ">>", argl: -15678, argr: 5}
    }]);
    assertEquals(c, -490);
  });



  Deno.test("<<", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: "<<", argl: 54, argr: 2}
    }]);
    assertEquals(c, 216);

    c = await run([{
      "set": "out",
      "value": {binop: "<<", argl: 2, argr: 7}
    }]);
    assertEquals(c, 256);

    c = await run([{
      "set": "out",
      "value": {binop: "<<", argl: 0, argr: 10}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: "<<", argl: 105, argr: 0}
    }]);
    assertEquals(c, 105);

    c = await run([{
      "set": "out",
      "value": {binop: "<<", argl: -15678, argr: 5}
    }]);
    assertEquals(c, -501696);
  });



  Deno.test("<", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: "<", argl: 50, argr: 50}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: "<", argl: 10, argr: 20}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: "<", argl: -10, argr: 0}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: "<", argl: 20, argr: 10}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: "<", argl: -10, argr: -5}
    }]);
    assertEquals(c, 1);
  });



  Deno.test("<=", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: "<=", argl: 50, argr: 50}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: "<=", argl: 10, argr: 20}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: "<=", argl: -10, argr: 0}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: "<=", argl: 20, argr: 10}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: "<=", argl: -10, argr: -5}
    }]);
    assertEquals(c, 1);
  });



  Deno.test(">", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: ">", argl: 50, argr: 50}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: ">", argl: 10, argr: 20}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: ">", argl: -10, argr: 0}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: ">", argl: 20, argr: 10}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: ">", argl: -10, argr: -5}
    }]);
    assertEquals(c, 0);
  });



  Deno.test(">=", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: ">=", argl: 50, argr: 50}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: ">=", argl: 10, argr: 20}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: ">=", argl: -10, argr: 0}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: ">=", argl: 20, argr: 10}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: ">=", argl: -10, argr: -5}
    }]);
    assertEquals(c, 0);
  });



  Deno.test("==", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: "==", argl: 50, argr: 50}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: "==", argl: 0, argr: 0}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: "==", argl: 10, argr: 20}
    }]);
    assertEquals(c, 0);
  });



  Deno.test("~=", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: "~=", argl: 50, argr: 50}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: "~=", argl: 0, argr: 0}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: "~=", argl: 10, argr: 20}
    }]);
    assertEquals(c, 1);
  });



  Deno.test("and", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: "and", argl: 10, argr: 20}
    }]);
    assertEquals(c, 20);

    c = await run([{
      "set": "out",
      "value": {binop: "and", argl: 0, argr: 1}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: "and", argl: -10, argr: 0}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: "and", argl: 10, argr: -50}
    }]);
    assertEquals(c,-50);

    c = await run([{
      "set": "out",
      "value": {binop: "and", argl: 10, argr: 38}
    }]);
    assertEquals(c, 38);
  });



  Deno.test("or", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: "or", argl: 10, argr: 20}
    }]);
    assertEquals(c, 10);

    c = await run([{
      "set": "out",
      "value": {binop: "or", argl: 0, argr: 1}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: "or", argl: -10, argr: 0}
    }]);
    assertEquals(c, -10);

    c = await run([{
      "set": "out",
      "value": {binop: "or", argl: 10, argr: -50}
    }]);
    assertEquals(c, 10);

    c = await run([{
      "set": "out",
      "value": {binop: "or", argl: 38, argr: 10}
    }]);
    assertEquals(c, 38);
  });



  Deno.test("neg", async () => {
    let c = await run([{
      "set": "out",
      "value": {unop: "-", arg: 10}
    }]);
    assertEquals(c, -10);

    c = await run([{
      "set": "out",
      "value": {unop: "-", arg: 0}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {unop: "-", arg: -210}
    }]);
    assertEquals(c, 210);
  });



  Deno.test("!", async () => {
    let c = await run([{
      "set": "out",
      "value": {unop: "!", arg: 10}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {unop: "!", arg: 0}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {unop: "!", arg: -210}
    }]);
    assertEquals(c, 0);
  });



  Deno.test("~", async () => {
    let c = await run([{
      "set": "out",
      "value": {unop: "~", arg: 10}
    }]);
    assertEquals(c, -11);

    c = await run([{
      "set": "out",
      "value": {unop: "~", arg: 0}
    }]);
    assertEquals(c, -1);

    c = await run([{
      "set": "out",
      "value": {unop: "~", arg: -210}
    }]);
    assertEquals(c, 209);
  });