import { run } from "./main.ts";
import {
  assertAlmostEquals,
  assertEquals,
} from "https://deno.land/std@0.155.0/testing/asserts.ts";

Deno.test("040", async () => {
  const c = await run([{
    "set": "i",
    "value": 100,
  }, {
    "set": "x",
    "value": 0,
  }, {
    "iterator": "i",
    "from": 0,
    "to": 8,
    "do": [{
      "set": "x",
      "value": {
        "binop": "+",
        "argl": "x",
        "argr": "i",
      },
    }],
  }, {
    "set": "out",
    "value": {
      "binop": "+",
      "argl": "x",
      "argr": "i",
    },
  }])
  assertEquals(c, 136);
});

Deno.test("026", async () => {
  const c = await run([{
    "set": "x",
    "value": {
      "unop": "-",
      "arg": 10,
    },
  }, {
    "if": [{
      "cond": {
        "binop": ">",
        "argl": "x",
        "argr": 0,
      },
      "then": [{
        "set": "y",
        "value": 44,
      }],
    }],
    "else": [{
      "set": "y",
      "value": 88,
    }],
  }, {
    "set": "out",
    "value": "y",
  }]);
  assertEquals(c, 88);
});

Deno.test("029", async () => {
  const c = await run([{
    "set": "x",
    "value": 100,
  }, {
    "if": [{
      "cond": {
        "binop": ">",
        "argl": "x",
        "argr": 0,
      },
      "then": [{
        "set": "y",
        "value": 1,
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 20,
        },
      },
      "then": [{
        "set": "y",
        "value": 2,
      }],
    }],
    "else": [{
      "set": "y",
      "value": 3,
    }],
  }, {
    "set": "out",
    "value": "y",
  }]);
  assertEquals(c, 1);
});

Deno.test("034", async () => {
  const c = await run([{
    "set": "x",
    "value": {
      "unop": "-",
      "arg": 55,
    },
  }, {
    "if": [{
      "cond": {
        "binop": ">",
        "argl": "x",
        "argr": 0,
      },
      "then": [{
        "set": "y",
        "value": 1,
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 100,
        },
      },
      "then": [{
        "set": "y",
        "value": 2,
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 50,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 50,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 60,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 60,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 65,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 65,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 75,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 75,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 90,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 90,
        },
      }],
    }],
    "else": [{
      "set": "y",
      "value": 3,
    }],
  }, {
    "set": "out",
    "value": "y",
  }]);
  assertEquals(c, -50);
});

Deno.test("028", async () => {
  const c = await run([{
    "set": "x",
    "value": {
      "unop": "-",
      "arg": 50,
    },
  }, {
    "if": [{
      "cond": {
        "binop": ">",
        "argl": "x",
        "argr": 0,
      },
      "then": [{
        "set": "y",
        "value": 1,
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 20,
        },
      },
      "then": [{
        "set": "y",
        "value": 2,
      }],
    }],
    "else": [{
      "set": "y",
      "value": 3,
    }],
  }, {
    "set": "out",
    "value": "y",
  }]);
  assertEquals(c, 2);
});

Deno.test("036", async () => {
  const c = await run([{
    "set": "x",
    "value": {
      "unop": "-",
      "arg": 100,
    },
  }, {
    "set": "y",
    "value": 0,
  }, {
    "while": {
      "binop": "<",
      "argl": "x",
      "argr": 100,
    },
    "do": [{
      "set": "y",
      "value": {
        "binop": "+",
        "argl": {
          "binop": "+",
          "argl": "y",
          "argr": "x",
        },
        "argr": 1,
      },
    }, {
      "if": [{
        "cond": {
          "binop": "<",
          "argl": "x",
          "argr": 50,
        },
        "then": [{
          "set": "x",
          "value": {
            "binop": "+",
            "argl": "x",
            "argr": 4,
          },
        }],
      }],
    }, {
      "set": "x",
      "value": {
        "binop": "+",
        "argl": "x",
        "argr": 20,
      },
    }],
  }, {
    "set": "out",
    "value": "y",
  }]);
  assertEquals(c, -31);
});

Deno.test("025", async () => {
  const c = await run([{
    "set": "x",
    "value": 1,
  }, {
    "if": [{
      "cond": {
        "binop": ">",
        "argl": "x",
        "argr": 0,
      },
      "then": [{
        "set": "y",
        "value": 44,
      }],
    }],
    "else": [{
      "set": "y",
      "value": 88,
    }],
  }, {
    "set": "out",
    "value": "y",
  }]);
  assertEquals(c, 44);
});

Deno.test("042", async () => {
  const c = await run([{
    "set": "x",
    "value": {
      "unop": "-",
      "arg": 55,
    },
  }, {
    "set": "y",
    "value": 0,
  }, {
    "set": "z",
    "value": 0,
  }, {
    "while": {
      "binop": "<",
      "argl": "x",
      "argr": 100,
    },
    "do": [{
      "set": "y",
      "value": {
        "binop": "+",
        "argl": {
          "binop": "+",
          "argl": "y",
          "argr": "x",
        },
        "argr": 1,
      },
    }, {
      "set": "x",
      "value": {
        "binop": "+",
        "argl": "x",
        "argr": 10,
      },
    }, {
      "if": [{
        "cond": {
          "binop": ">",
          "argl": "x",
          "argr": 50,
        },
        "then": ["break"],
      }],
    }, {
      "set": "z",
      "value": {
        "binop": "+",
        "argl": "z",
        "argr": 1,
      },
    }],
  }, {
    "set": "out",
    "value": {
      "binop": "+",
      "argl": "y",
      "argr": "z",
    },
  }]);
  assertEquals(c, -34);
});

Deno.test("041", async () => {
  const c = await run([{
    "set": "i",
    "value": 100,
  }, {
    "set": "x",
    "value": 0,
  }, {
    "iterator": "i",
    "from": 0,
    "to": 8,
    "step": 2,
    "do": [{
      "set": "x",
      "value": {
        "binop": "+",
        "argl": "x",
        "argr": "i",
      },
    }],
  }, {
    "set": "out",
    "value": {
      "binop": "+",
      "argl": "x",
      "argr": "i",
    },
  }]);
  assertEquals(c, 120);
});

Deno.test("038", async () => {
  const c = await run([{
    "set": "x",
    "value": 20,
  }, {
    "set": "y",
    "value": 0,
  }, {
    "do": [{
      "set": "x",
      "value": {
        "binop": "+",
        "argl": "x",
        "argr": 1,
      },
    }, {
      "set": "y",
      "value": {
        "binop": "+",
        "argl": "y",
        "argr": 2,
      },
    }],
    "until": {
      "binop": ">",
      "argl": "y",
      "argr": "x",
    },
  }, {
    "set": "out",
    "value": {
      "binop": "*",
      "argl": "y",
      "argr": "x",
    },
  }]);
  assertEquals(c, 1722);
});

Deno.test("037", async () => {
  const c = await run([{
    "set": "x",
    "value": 0,
  }, {
    "set": "y",
    "value": 0,
  }, {
    "while": {
      "binop": "<",
      "argl": "x",
      "argr": 12,
    },
    "do": [{
      "set": "y",
      "value": {
        "binop": "+",
        "argl": "y",
        "argr": "x",
      },
    }, {
      "set": "x",
      "value": {
        "binop": "+",
        "argl": "x",
        "argr": 1,
      },
    }],
  }, {
    "set": "out",
    "value": "y",
  }]);
  assertEquals(c, 66);
});

Deno.test("035", async () => {
  const c = await run([{
    "set": "x",
    "value": {
      "unop": "-",
      "arg": 55,
    },
  }, {
    "set": "y",
    "value": 0,
  }, {
    "while": {
      "binop": "<",
      "argl": "x",
      "argr": 100,
    },
    "do": [{
      "set": "y",
      "value": {
        "binop": "+",
        "argl": {
          "binop": "+",
          "argl": "y",
          "argr": "x",
        },
        "argr": 1,
      },
    }, {
      "set": "x",
      "value": {
        "binop": "+",
        "argl": "x",
        "argr": 10,
      },
    }],
  }, {
    "set": "out",
    "value": "y",
  }]);
  assertEquals(c, 336);
});

Deno.test("039", async () => {
  const c = await run([{
    "set": "x",
    "value": 20,
  }, {
    "set": "y",
    "value": 0,
  }, {
    "do": [{
      "set": "x",
      "value": {
        "binop": "+",
        "argl": "x",
        "argr": 1,
      },
    }, {
      "set": "y",
      "value": {
        "binop": "+",
        "argl": "y",
        "argr": 2,
      },
    }],
    "until": 1,
  }, {
    "set": "out",
    "value": {
      "binop": "*",
      "argl": "y",
      "argr": "x",
    },
  }]);
  assertEquals(c, 42);
});

Deno.test("030", async () => {
  const c = await run([{
    "set": "x",
    "value": 100,
  }, {
    "if": [{
      "cond": {
        "binop": ">",
        "argl": "x",
        "argr": 0,
      },
      "then": [{
        "set": "y",
        "value": 1,
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 100,
        },
      },
      "then": [{
        "set": "y",
        "value": 2,
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 50,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 50,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 60,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 60,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 65,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 65,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 75,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 75,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 90,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 90,
        },
      }],
    }],
    "else": [{
      "set": "y",
      "value": 3,
    }],
  }, {
    "set": "out",
    "value": "y",
  }]);
  assertEquals(c, 1);
});

Deno.test("045", async () => {
  const c = await run([{
    "set": "i",
    "value": 100,
  }, {
    "set": "x",
    "value": 0,
  }, {
    "iterator": "i",
    "from": 0,
    "to": 8,
    "step": 2,
    "do": [{
      "if": [{
        "cond": {
          "binop": "==",
          "argl": "x",
          "argr": 2,
        },
        "then": ["break"],
      }],
    }, {
      "set": "x",
      "value": {
        "binop": "+",
        "argl": "x",
        "argr": "i",
      },
    }],
  }, {
    "set": "out",
    "value": {
      "binop": "+",
      "argl": "x",
      "argr": "i",
    },
  }]);
  assertEquals(c, 102);
});

Deno.test("032", async () => {
  const c = await run([{
    "set": "x",
    "value": {
      "unop": "-",
      "arg": 80,
    },
  }, {
    "if": [{
      "cond": {
        "binop": ">",
        "argl": "x",
        "argr": 0,
      },
      "then": [{
        "set": "y",
        "value": 1,
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 100,
        },
      },
      "then": [{
        "set": "y",
        "value": 2,
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 50,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 50,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 60,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 60,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 65,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 65,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 75,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 75,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 90,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 90,
        },
      }],
    }],
    "else": [{
      "set": "y",
      "value": 3,
    }],
  }, {
    "set": "out",
    "value": "y",
  }]);
  assertEquals(c, -50);
});

Deno.test("027", async () => {
  const c = await run([{
    "set": "x",
    "value": {
      "unop": "-",
      "arg": 10,
    },
  }, {
    "if": [{
      "cond": {
        "binop": ">",
        "argl": "x",
        "argr": 0,
      },
      "then": [{
        "set": "y",
        "value": 1,
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 20,
        },
      },
      "then": [{
        "set": "y",
        "value": 2,
      }],
    }],
    "else": [{
      "set": "y",
      "value": 3,
    }],
  }, {
    "set": "out",
    "value": "y",
  }]);
  assertEquals(c, 3);
});

Deno.test("031", async () => {
  const c = await run([{
    "set": "x",
    "value": {
      "unop": "-",
      "arg": 500,
    },
  }, {
    "if": [{
      "cond": {
        "binop": ">",
        "argl": "x",
        "argr": 0,
      },
      "then": [{
        "set": "y",
        "value": 1,
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 100,
        },
      },
      "then": [{
        "set": "y",
        "value": 2,
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 50,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 50,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 60,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 60,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 65,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 65,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 75,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 75,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 90,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 90,
        },
      }],
    }],
    "else": [{
      "set": "y",
      "value": 3,
    }],
  }, {
    "set": "out",
    "value": "y",
  }]);
  assertEquals(c, 2);
});

Deno.test("033", async () => {
  const c = await run([{
    "set": "x",
    "value": {
      "unop": "-",
      "arg": 95,
    },
  }, {
    "if": [{
      "cond": {
        "binop": ">",
        "argl": "x",
        "argr": 0,
      },
      "then": [{
        "set": "y",
        "value": 1,
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 100,
        },
      },
      "then": [{
        "set": "y",
        "value": 2,
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 50,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 50,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 60,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 60,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 65,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 65,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 75,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 75,
        },
      }],
    }, {
      "cond": {
        "binop": "<",
        "argl": "x",
        "argr": {
          "unop": "-",
          "arg": 90,
        },
      },
      "then": [{
        "set": "y",
        "value": {
          "unop": "-",
          "arg": 90,
        },
      }],
    }],
    "else": [{
      "set": "y",
      "value": 3,
    }],
  }, {
    "set": "out",
    "value": "y",
  }]);
  assertEquals(c, -50);
});

Deno.test("006", async () => {
  const c = await run([{
    "set": "out",
    "value": {
      "binop": "|",
      "argl": {
        "binop": "+",
        "argl": {
          "binop": "+",
          "argl": 1,
          "argr": {
            "binop": "*",
            "argl": 2,
            "argr": 5,
          },
        },
        "argr": 4,
      },
      "argr": {
        "binop": "&",
        "argl": {
          "binop": "+",
          "argl": 12,
          "argr": 33,
        },
        "argr": {
          "binop": ">>",
          "argl": {
            "binop": "-",
            "argl": 256,
            "argr": 4,
          },
          "argr": {
            "binop": "-",
            "argl": {
              "binop": "*",
              "argl": 2,
              "argr": 3,
            },
            "argr": {
              "binop": "or",
              "argl": {
                "binop": "and",
                "argl": {
                  "binop": ">",
                  "argl": 4,
                  "argr": 8,
                },
                "argr": 1,
              },
              "argr": 0,
            },
          },
        },
      },
    },
  }]);
  assertEquals(c, 15);
});

Deno.test("001", async () => {
  const c = await run([{
    "set": "out",
    "value": 1,
  }]);
  assertEquals(c, 1);
});

Deno.test("003", async () => {
  const c = await run([{
    "set": "out",
    "value": {
      "binop": "and",
      "argl": {
        "binop": "|",
        "argl": {
          "binop": "+",
          "argl": {
            "binop": "+",
            "argl": 1,
            "argr": {
              "binop": "*",
              "argl": 2,
              "argr": 5,
            },
          },
          "argr": 4,
        },
        "argr": {
          "binop": "&",
          "argl": {
            "binop": "+",
            "argl": 12,
            "argr": 33,
          },
          "argr": 256,
        },
      },
      "argr": {
        "binop": "<<",
        "argl": 4,
        "argr": {
          "binop": "*",
          "argl": 2,
          "argr": 3,
        },
      },
    },
  }]);
  assertEquals(c, 256);
});

Deno.test("009", async () => {
  const c = await run([{
    "set": "out",
    "value": {
      "binop": "^",
      "argl": 7,
      "argr": {
        "binop": "^",
        "argl": 7,
        "argr": {
          "unop": "-",
          "arg": {
            "binop": "^",
            "argl": {
              "binop": "/",
              "argl": 1,
              "argr": 2,
            },
            "argr": 2,
          },
        },
      },
    },
  }]);
  assertAlmostEquals(c, 3.3079296368936, 1e-5);
});

Deno.test("002", async () => {
  const c = await run([{
    "set": "out",
    "value": {
      "binop": "+",
      "argl": 1,
      "argr": 2,
    },
  }]);
  assertEquals(c, 3);
});

Deno.test("007", async () => {
  const c = await run([{
    "set": "out",
    "value": {
      "binop": "or",
      "argl": {
        "binop": "and",
        "argl": {
          "binop": ">",
          "argl": {
            "binop": "|",
            "argl": {
              "binop": "+",
              "argl": {
                "binop": "+",
                "argl": 1,
                "argr": {
                  "binop": "*",
                  "argl": 2,
                  "argr": 5,
                },
              },
              "argr": 4,
            },
            "argr": {
              "binop": "&",
              "argl": {
                "binop": "+",
                "argl": 12,
                "argr": 33,
              },
              "argr": {
                "binop": ">>",
                "argl": {
                  "binop": "-",
                  "argl": 256,
                  "argr": 4,
                },
                "argr": {
                  "binop": "-",
                  "argl": {
                    "binop": "*",
                    "argl": 2,
                    "argr": 3,
                  },
                  "argr": 4,
                },
              },
            },
          },
          "argr": 8,
        },
        "argr": 1,
      },
      "argr": 0,
    },
  }]);
  assertEquals(c, 1);
});

Deno.test("005", async () => {
  const c = await run([{
    "set": "out",
    "value": {
      "binop": "or",
      "argl": {
        "binop": "or",
        "argl": {
          "binop": "|",
          "argl": {
            "binop": "+",
            "argl": {
              "binop": "+",
              "argl": 1,
              "argr": {
                "binop": "*",
                "argl": 2,
                "argr": 5,
              },
            },
            "argr": 4,
          },
          "argr": {
            "binop": "&",
            "argl": {
              "binop": "+",
              "argl": 12,
              "argr": 33,
            },
            "argr": 256,
          },
        },
        "argr": {
          "binop": ">>",
          "argl": 4,
          "argr": {
            "binop": "*",
            "argl": 2,
            "argr": 3,
          },
        },
      },
      "argr": {
        "binop": ">",
        "argl": 4,
        "argr": 8,
      },
    },
  }]);
  assertEquals(c, 15);
});

Deno.test("004", async () => {
  const c = await run([{
    "set": "out",
    "value": {
      "binop": "or",
      "argl": {
        "binop": "|",
        "argl": {
          "binop": "+",
          "argl": {
            "binop": "+",
            "argl": 1,
            "argr": {
              "binop": "*",
              "argl": 2,
              "argr": 5,
            },
          },
          "argr": 4,
        },
        "argr": {
          "binop": "+",
          "argl": 12,
          "argr": 33,
        },
      },
      "argr": {
        "binop": "<<",
        "argl": 4,
        "argr": 2,
      },
    },
  }]);
  assertEquals(c, 47);
});

Deno.test("010", async () => {
  const c = await run([{
    "set": "out",
    "value": {
      "binop": "-",
      "argl": 2,
      "argr": {
        "unop": "-",
        "arg": {
          "unop": "-",
          "arg": 2,
        },
      },
    },
  }]);
  assertEquals(c, 0);
});

Deno.test("008", async () => {
  const c = await run([{
    "set": "out",
    "value": {
      "binop": "^",
      "argl": 2,
      "argr": {
        "binop": "^",
        "argl": 3,
        "argr": 2,
      },
    },
  }]);
  assertEquals(c, 512.0);
});

Deno.test("049.semi", async () => {
  const c = await run([{
    "function": "add",
    "args": ["x", "y"],
    "block": [{
      "set": "z",
      "value": 0,
    }, {
      "iterator": "i",
      "from": 0,
      "to": "x",
      "do": [{
        "set": "z",
        "value": {
          "call": "inc",
          "args": ["z"],
        },
      }],
    }, {
      "return": "z",
    }],
  }, {
    "function": "inc",
    "args": ["x"],
    "block": [{
      "return": {
        "binop": "+",
        "argl": "x",
        "argr": 1,
      },
    }],
  }, {
    "set": "out",
    "value": {
      "call": "add",
      "args": [4, 3],
    },
  }]);
  assertEquals(c, 5);
});

Deno.test("047", async () => {
  const c = await run([{
    "function": "inc",
    "args": ["x"],
    "block": [{
      "return": {
        "binop": "+",
        "argl": "x",
        "argr": 1,
      },
    }],
  }, {
    "set": "out",
    "value": {
      "call": "inc",
      "args": [10],
    },
  }]);
  assertEquals(c, 11);
});

Deno.test("050", async () => {
  const c = await run([{
    "function": "inc",
    "args": ["x"],
    "block": [{
      "return": {
        "binop": "+",
        "argl": "x",
        "argr": 1,
      },
    }],
  }, {
    "function": "add",
    "args": ["x", "y"],
    "block": [{
      "set": "z",
      "value": 0,
    }, {
      "iterator": "i",
      "from": 0,
      "to": "x",
      "do": [{
        "set": "z",
        "value": {
          "call": "inc",
          "args": ["z"],
        },
      }],
    }, {
      "return": "z",
    }],
  }, {
    "set": "out",
    "value": {
      "binop": "+",
      "argl": {
        "call": "add",
        "args": [4, 3],
      },
      "argr": {
        "call": "inc",
        "args": [1],
      },
    },
  }]);
  assertEquals(c, 7);
});

Deno.test("051.semi", async () => {
  const c = await run([{
    "function": "add_rec",
    "args": ["x", "y"],
    "block": [{
      "if": [{
        "cond": {
          "binop": "==",
          "argl": "x",
          "argr": 0,
        },
        "then": [{
          "return": "y",
        }],
      }],
      "else": [{
        "return": {
          "call": "add_rec",
          "args": ["y", {
            "binop": "-",
            "argl": "x",
            "argr": 1,
          }],
        },
      }],
    }],
  }, {
    "set": "out",
    "value": {
      "call": "add_rec",
      "args": [4, 3],
    },
  }]);
  assertEquals(c, 0);
});

Deno.test("052", async () => {
  const c = await run([{
    "set": "x",
    "value": 0,
  }, {
    "function": "make_it_six",
    "args": [],
    "block": [{
      "set": "x",
      "value": {
        "binop": "+",
        "argl": "x",
        "argr": 1,
      },
    }, {
      "if": [{
        "cond": {
          "binop": "<",
          "argl": "x",
          "argr": 6,
        },
        "then": [{
          "call": "make_it_six",
          "args": [],
        }],
      }],
    }, {
      "return": "x",
    }],
  }, {
    "set": "out",
    "value": {
      "call": "make_it_six",
      "args": [],
    },
  }]);
  assertEquals(c, 6);
});

Deno.test("048", async () => {
  const c = await run([{
    "function": "inc",
    "args": ["x"],
    "block": [{
      "return": {
        "binop": "+",
        "argl": "x",
        "argr": 1,
      },
    }],
  }, {
    "function": "add",
    "args": ["x", "y"],
    "block": [{
      "set": "z",
      "value": 0,
    }, {
      "iterator": "i",
      "from": 0,
      "to": "x",
      "do": [{
        "set": "z",
        "value": {
          "call": "inc",
          "args": ["z"],
        },
      }],
    }, {
      "return": "z",
    }],
  }, {
    "set": "out",
    "value": {
      "call": "add",
      "args": [4, 3],
    },
  }]);
  assertEquals(c, 5);
});

Deno.test("020", async () => {
  const c = await run([{
    "set": "x",
    "value": 1,
  }, [{
    "set": "x",
    "value": 2,
  }, [{
    "set": "x",
    "value": 3,
  }]], {
    "set": "out",
    "value": "x",
  }]);
  assertEquals(c, 3);
});

Deno.test("018", async () => {
  const c = await run([{
    "set": "x",
    "value": 1,
  }, [{
    "declare": "x",
    "value": 2,
  }, [{
    "set": "x",
    "value": 3,
  }], {
    "set": "out",
    "value": "x",
  }]]);
  assertEquals(c, 3);
});

Deno.test("017", async () => {
  const c = await run([{
    "set": "x",
    "value": 1,
  }, [{
    "declare": "x",
    "value": 2,
  }], {
    "set": "out",
    "value": "x",
  }]);
  assertEquals(c, 1);
});

Deno.test("019", async () => {
  const c = await run([{
    "set": "x",
    "value": 1,
  }, [{
    "declare": "x",
    "value": 2,
  }, [{
    "set": "x",
    "value": 3,
  }]], {
    "set": "out",
    "value": "x",
  }]);
  assertEquals(c, 1);
});

Deno.test("021", async () => {
  const c = await run([{
    "set": "x",
    "value": 1,
  }, [{
    "declare": "x",
    "value": 2,
  }, [{
    "declare": "x",
    "value": 3,
  }]], {
    "set": "out",
    "value": "x",
  }]);
  assertEquals(c, 1);
});

Deno.test("015", async () => {
  const c = await run([{
    "set": "x",
    "value": 1,
  }, [{
    "set": "x",
    "value": 2,
  }, {
    "set": "y",
    "value": 4,
  }], {
    "set": "out",
    "value": "x",
  }]);
  assertEquals(c, 2);
});

Deno.test("016", async () => {
  const c = await run([{
    "set": "x",
    "value": 1,
  }, [{
    "set": "x",
    "value": 2,
  }, {
    "set": "y",
    "value": 4,
  }], {
    "set": "out",
    "value": "y",
  }]);
  assertEquals(c, 4);
});

Deno.test("023", async () => {
  const c = await run([[{
    "set": "x",
    "value": 2,
  }, [{
    "declare": "x",
    "value": 3,
  }]], {
    "set": "out",
    "value": "x",
  }]);
  assertEquals(c, 2);
});
