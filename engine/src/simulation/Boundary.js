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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Boundary = void 0;
// Migrated from namespace Simulation to ES module
var PolygonBody_1 = require("../physics/PolygonBody");
var Identity_1 = require("../models/Identity");
var Boundary = /** @class */ (function (_super) {
    __extends(Boundary, _super);
    function Boundary(vertices) {
        var _this = _super.call(this, vertices !== null && vertices !== void 0 ? vertices : []) || this;
        _this.area = 0;
        _this.segments = [];
        _this.inverted = false;
        _this.id = Identity_1.IdentityService.newIdentity();
        _this.vertices = vertices !== null && vertices !== void 0 ? vertices : [];
        _this.boundingBox = { x1: 0, y1: 0, x2: 0, y2: 0, clone: function () { return ({ x1: 0, y1: 0, x2: 0, y2: 0, clone: function () { return this; } }); } };
        _this.bounds = _this.boundingBox;
        _this.resolveMask = 255;
        _this.contactMask = 255;
        _this.segments.forEach(function (seg) {
            seg.id = Identity_1.IdentityService.newIdentity();
            seg.parentID = _this.id;
        });
        return _this;
    }
    Boundary.prototype.clone = function () {
        // Implement a proper deep clone as needed
        return new Boundary(__spreadArray([], this.vertices, true));
    };
    return Boundary;
}(PolygonBody_1.PolygonBody));
exports.Boundary = Boundary;
//# sourceMappingURL=Boundary.js.map