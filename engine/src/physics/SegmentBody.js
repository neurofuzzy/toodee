"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SegmentBody = void 0;
// Migrated from namespace Physics to ES module
var BaseGeom_1 = require("../geom/BaseGeom");
var SegmentBody = /** @class */ (function () {
    function SegmentBody() {
        this.isBoundary = false;
        this.cor = 1;
        this.pressure = 0.1;
    }
    SegmentBody.prototype.initWithOriginAndAngle = function (ox, oy, angle, length, parentID) {
        this.ray = new BaseGeom_1.Ray(ox, oy, angle, length, parentID);
    };
    return SegmentBody;
}());
exports.SegmentBody = SegmentBody;
//# sourceMappingURL=SegmentBody.js.map