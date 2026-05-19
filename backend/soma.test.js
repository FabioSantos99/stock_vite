import { describe, it, expect } from "vitest";
import { soma } from "./soma";

describe("soma", () => {
    it("deve retornar 1 quando multiplicar 1 * 1", () => {
        const resultado = soma(1, 1);
        expect(resultado).toBe(1);
    });

    it("deve retornar 0 quando multiplicar 1 * 0", () => {
        const resultado = soma(1, 0);
        expect(resultado).toBe(0);
    });
});