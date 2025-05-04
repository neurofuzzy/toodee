"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Beam = void 0;
// Migrated from namespace Simulation to ES module
var SegmentBody_1 = require("../physics/SegmentBody");
var Identity_1 = require("../models/Identity");
var BaseGeom_1 = require("../geom/BaseGeom");
var Beam = /** @class */ (function (_super) {
    __extends(Beam, _super);
    function Beam() {
        var _this = _super.call(this) || this;
        _this.id = Identity_1.IdentityService.newIdentity();
        _this.resolveMask = 255;
        _this.contactMask = 255;
        return _this;
    }
    Beam.prototype.initWithOriginAndAngle = function (ox, oy, angle, length, parentID) {
        this.parentID = parentID;
        this.ray = new BaseGeom_1.Ray(ox, oy, angle, length, this.id);
    };
    return Beam;
}(SegmentBody_1.SegmentBody));
exports.Beam = Beam;
//# sourceMappingURL=Beam.js.map