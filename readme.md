# Laboratorio 5 de Lenguajes y Compiladores versión 2

Compilador y VM de JsonLang

Para más detalles, visitar
[compiladores.github.io](https://compiladores.github.io).

## Quickstart, editor, dependencias

```
make setup
```

Instala `deno` 1.26.0 en la carpeta raíz del repositorio, y crea una carpeta
`.vscode` con la configuración recomendada de vscode.

### Cómo hacer el laboratorio

Completar la implementación de `main.ts` de manera que pasen todos los tests
incluidos.

### Arquitectura general del proyecto.

Se utilizó una arquitectura más bien funcional, donde el programa se traduce  5 veces. En cada traducción se resuelve un problema.

1. CompIR0Translator: Elimina ("desdobla"/"despliega"/"unfolds") estructuras de control
2. CompIR1Translator: Elimina variables
3. CompIR2Translator: Elimina expresiones
4. CompIR3Translator: Elimina funciones
5. CompIR4Translator: Elimina labels

Los algoritmos que debe seguir cada etapa de la traducción se detallan en clase. Los algoritmos aplicados por `CompIR0Translator` y `CompIR1Translator` son similares a los que aplica el intérprete.

### Criterios de evaluación

La evaluación es objetiva. Al presentar el laboratorio se dará una fecha
recomendada de entrega. Al entregar el laboratorio se puntuará de la siguiente
forma.

| Parámetro                                                          | comandos relacionados             | puntaje |
| ------------------------------------------------------------------ | --------------------------------- | ------- |
| se entregó el TP                                                   | `make test`, `make test_checksum` | 6       |
| El último commit del PR tiene fecha previa a la recomendada        | `make test_date`                  | +1      |
| El último commit del PR tiene fecha previa a la recomendada tardía | `make test_late_date`             | +2      |
| Se agregaron 5 tests que contienen "extra" en su descripción       | `make test_extra_quantity`        | +2      |
