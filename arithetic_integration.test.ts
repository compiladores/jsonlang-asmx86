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

  c = await run([{
    "set": "out",
    "value": {binop: "+", argl: 0.1, argr: 0.2}
  }]);
  assertEquals(c, 0.3);   //Oficialmente le gané a Javascript
  // Realmente en la ejecucion del codigo, sigue teniendo el mismo
  // problema de precision, pero al printear el valor
  // se redondea a 6 decimales. 

  c = await run([{
    "set": "out",
    "value": {binop: "+", argl: 10.5, argr: 5481.1}
  }]);
  assertEquals(c, 5491.6);

  c = await run([{
    "set": "out",
    "value": {binop: "+", argl: 0.5, argr: -1.50}
  }]);
  assertEquals(c, -1);
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

  c = await run([{
    "set": "out",
    "value": {binop: "-", argl: 0.1, argr: 0.2}
  }]);
  assertEquals(c, -0.1);

  c = await run([{
    "set": "out",
    "value": {binop: "-", argl: 10.5, argr: 5481.1}
  }]);
  assertEquals(c, -5470.6);

  c = await run([{
    "set": "out",
    "value": {binop: "-", argl: 0.5, argr: -1.50}
  }]);
  assertEquals(c, 2);
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

    c = await run([{
      "set": "out",
      "value": {binop: "*", argl: 50, argr: 0.2}
    }]);
    assertEquals(c, 10);

    c = await run([{
      "set": "out",
      "value": {binop: "*", argl: 0.52, argr: 0.48}
    }]);
    assertEquals(c, 0.2496);

    c = await run([{
      "set": "out",
      "value": {binop: "*", argl: 100.3, argr: -15.25}
    }]);
    assertEquals(c, -1529.575);
  });



  Deno.test("/", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: "/", argl: 100, argr: 50}
    }]);
    assertEquals(c, 2);

    c = await run([{
      "set": "out",
      "value": {binop: "/", argl: 1, argr: 2}
    }]);
    assertEquals(c, 0.5);
    
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

    c = await run([{
      "set": "out",
      "value": {binop: "/", argl: 50, argr: 0.2}
    }]);
    assertEquals(c, 250);

    c = await run([{
      "set": "out",
      "value": {binop: "/", argl: 0.52, argr: 0.48}
    }]);
    assertEquals(c, 1.083333);

    c = await run([{
      "set": "out",
      "value": {binop: "/", argl: 100.3, argr: -15.25}
    }]);
    assertEquals(c, -6.577049);
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

    c = await run([{
      "set": "out",
      "value": {binop: "^", argl: 9, argr: 0.5}
    }]);
    assertEquals(c, 3);

    c = await run([{
      "set": "out",
      "value": {binop: "^", argl: 752, argr: 0.5}
    }]);
    assertEquals(c, 27.422618);

    c = await run([{
      "set": "out",
      "value": {binop: "^", argl: 15.5487, argr: 2.8429}
    }]);
    assertEquals(c, 2442.683013);
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

    c = await run([{
      "set": "out",
      "value": {binop: "%", argl: 50, argr: 0.2}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: "%", argl: 0.52, argr: 0.48}
    }]);
    assertEquals(c, 0.04);

    c = await run([{
      "set": "out",
      "value": {binop: "%", argl: 100.3, argr: -15.25}
    }]);
    assertEquals(c, 8.8);
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
    
    c = await run([{
      "set": "out",
      "value": {binop: "&", argl: 10.25, argr: 38.25}
    }]);
    assertEquals(c, 2.25);

    c = await run([{
      "set": "out",
      "value": {binop: "&", argl: 246.10, argr: 236.10}
    }]);
    assertEquals(c, 228.10);
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


    c = await run([{
      "set": "out",
      "value": {binop: "|", argl: -10.5, argr: 1.25}
    }]);
    assertEquals(c, -10.25);

    c = await run([{
      "set": "out",
      "value": {binop: "|", argl: 246.2, argr: 236.658}
    }]);
    assertEquals(c, 254.732234);

    
    c = await run([{
      "set": "out",
      "value": {binop: "|", argl: 10.1, argr: 38.025}
    }]);
    assertEquals(c, 46.125);
  });



  Deno.test(">>", async () => {
    let c = await run([{
      "set": "out",
      "value": {binop: ">>", argl: 54, argr: 2}
    }]);
    assertEquals(c, 13.5);

    c = await run([{
      "set": "out",
      "value": {binop: ">>", argl: 2, argr: 7}
    }]);
    assertEquals(c, 0.015625);

    c = await run([{
      "set": "out",
      "value": {binop: ">>", argl: 1, argr: 1}
    }]);
    assertEquals(c, 0.5);

    c = await run([{
      "set": "out",
      "value": {binop: ">>", argl: 105, argr: 0}
    }]);
    assertEquals(c, 105);

    
    c = await run([{
      "set": "out",
      "value": {binop: ">>", argl: 15678, argr: 5}
    }]);
    assertEquals(c, 489.9375);

    c = await run([{
      "set": "out",
      "value": {binop: ">>", argl: 15678.324, argr: 5.526}
    }]);
    assertEquals(c, 489.947625);
  
    c = await run([{
      "set": "out",
      "value": {binop: ">>", argl: 1.125, argr: 1}
    }]);
    assertEquals(c, 0.5625);
  
    c = await run([{
      "set": "out",
      "value": {binop: ">>", argl: 105.015, argr: 0.1558}
    }]);
    assertEquals(c, 105.015);
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

    c = await run([{
      "set": "out",
      "value": {binop: "<<", argl: 0.03165, argr: 10.0321}
    }]);
    assertEquals(c, 32.4096);

    c = await run([{
      "set": "out",
      "value": {binop: "<<", argl: 105.0321, argr: 0.65687}
    }]);
    assertEquals(c, 105.0321);

    c = await run([{
      "set": "out",
      "value": {binop: "<<", argl: -15678.1884, argr: 5.6548}
    }]);
    assertEquals(c, -501702.0288);
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
      "value": {binop: "<", argl: 0, argr: 0.0000001}
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: "<", argl: 21518875.00000001, argr: 21518875.00000001}
    }]);
    assertEquals(c, 0);
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

    c = await run([{
      "set": "out",
      "value": {binop: "<=", argl: 0.0000001, argr: 0}
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: "<=", argl: 21518875.00000001, argr: 21518875.00000001}
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

    c = await run([{
      "set": "out",
      "value": {binop: ">", argl: 521321688, argr:521321687.9999999 }
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: ">", argl: 21518875.00000001, argr: 21518875.00000001}
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

    c = await run([{
      "set": "out",
      "value": {binop: ">=", argl:521321687.9999999 , argr:521321688 }
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: ">=", argl: 21518875.00000001, argr: 21518875.00000001}
    }]);
    assertEquals(c, 1);
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
    
    c = await run([{
      "set": "out",
      "value": {binop: "==", argl:0.00000000015 , argr:0.00000000011 }  //Mayor presicion posible
    }]);
    assertEquals(c, 0);
    
    c = await run([{
      "set": "out",
      "value": {binop: "==", argl:0.00000000015 , argr:0.00000000016 }  //ambos los toma como 2.33*10**-10
    }]);
    assertEquals(c, 1);

    c = await run([{
      "set": "out",
      "value": {binop: "==", argl:0.55 , argr:0.55 }  //ambos los toma como 2.33*10**-10
    }]);
    assertEquals(c, 1);
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

    
    
    c = await run([{
      "set": "out",
      "value": {binop: "~=", argl:0.00000000015 , argr:0.00000000011 }  //Mayor presicion posible
    }]);
    assertEquals(c, 1);
    
    c = await run([{
      "set": "out",
      "value": {binop: "~=", argl:0.00000000015 , argr:0.00000000016 }  //ambos los toma como 2.33*10**-10
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {binop: "~=", argl:0.55 , argr:0.55 }  //ambos los toma como 2.33*10**-10
    }]);
    assertEquals(c, 0);
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

    c = await run([{
      "set": "out",
      "value": {binop: "and", argl: 0.01, argr: 0.000001}
    }]);
    assertEquals(c, 0.000001);

    c = await run([{
      "set": "out",
      "value": {binop: "and", argl: 5120.1, argr:238.3}
    }]);
    assertEquals(c, 238.3);
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

    c = await run([{
      "set": "out",
      "value": {binop: "or", argl: 0.00001, argr: 0}
    }]);
    assertEquals(c, 0.00001);

    c = await run([{
      "set": "out",
      "value": {binop: "or", argl: 0, argr: 314168.63154}
    }]);
    assertEquals(c, 314168.63154);
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

    c = await run([{
      "set": "out",
      "value": {unop: "-", arg: 0.0154}
    }]);
    assertEquals(c, -0.0154);

    c = await run([{
      "set": "out",
      "value": {unop: "-", arg: 5232185.999999}
    }]);
    assertEquals(c, -5232185.999999);
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

    c = await run([{
      "set": "out",
      "value": {unop: "!", arg:0.00000000015}  //Mayor presicion posible
    }]);
    assertEquals(c, 0);

    c = await run([{
      "set": "out",
      "value": {unop: "!", arg:542.548}  //Mayor presicion posible
    }]);
    assertEquals(c, 0);
  });



  Deno.test("~", async () => {
    let c = await run([{
      "set": "out",
      "value": {unop: "~", arg: 1}
    }]);
    
    assertEquals(c, -2);

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

    c = await run([{
      "set": "out",
      "value": {unop: "~", arg:10.75}
    }]);
    assertEquals(c, -11);

  
    c = await run([{
      "set": "out",
      "value": {unop: "~", arg:0.999999999}
    }]);
    assertEquals(c, -1);
  });
