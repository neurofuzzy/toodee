// engine/src/util/Pairing.ts
export function cantorPair(a: number, b: number): number {
  return ((a + b) * (a + b + 1)) / 2 + b;
}