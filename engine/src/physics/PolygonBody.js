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
exports.PolygonBody = void 0;
// Migrated from namespace Physics to ES module
var BaseGeom_1 = require("../geom/BaseGeom");
var PolygonBody = /** @class */ (function (_super) {
    __extends(PolygonBody, _super);
    function PolygonBody(vertices) {
        var _this = _super.call(this, vertices) || this;
        _this.drag = 0.01;
        _this.cor = 1;
        return _this;
    }
    return PolygonBody;
}(BaseGeom_1.Polygon));
exports.PolygonBody = PolygonBody;
//# sourceMappingURL=PolygonBody.js.map