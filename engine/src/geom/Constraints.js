"use strict";
// Migrated from namespace Geom to ES module
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constraints = void 0;
var Constraints = /** @class */ (function () {
    function Constraints(lockX, lockY, lockRotation) {
        if (lockX === void 0) { lockX = true; }
        if (lockY === void 0) { lockY = true; }
        if (lockRotation === void 0) { lockRotation = true; }
        this.lockX = lockX;
        this.lockY = lockY;
        this.lockRotation = lockRotation;
    }
    return Constraints;
}());
exports.Constraints = Constraints;
//# sourceMappingURL=Constraints.js.map