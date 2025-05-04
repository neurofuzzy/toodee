"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSpatial = void 0;
var BaseSpatial = /** @class */ (function () {
    function BaseSpatial() {
    }
    BaseSpatial.prototype.initWithBounds = function (bounds) {
        this.bounds = bounds;
        this.rotation = 0;
        return this;
    };
    return BaseSpatial;
}());
exports.BaseSpatial = BaseSpatial;
//# sourceMappingURL=BaseSpatial.js.map