"use strict";
// Migrated from namespace Models to ES module
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityService = void 0;
var IdentityService = /** @class */ (function () {
    function IdentityService() {
    }
    IdentityService.newIdentity = function () {
        return IdentityService.lastID++;
    };
    IdentityService.lastID = 0;
    return IdentityService;
}());
exports.IdentityService = IdentityService;
//# sourceMappingURL=Identity.js.map