"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cantorPair = cantorPair;
// engine/src/util/Pairing.ts
function cantorPair(a, b) {
    return ((a + b) * (a + b + 1)) / 2 + b;
}
//# sourceMappingURL=Pairing.js.map