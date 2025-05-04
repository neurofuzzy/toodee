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
exports.BaseBody = void 0;
var BaseSpatial_1 = require("../geom/BaseSpatial");
var BaseBody = /** @class */ (function (_super) {
    __extends(BaseBody, _super);
    function BaseBody() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BaseBody.prototype.initWithBoundsAndConstraints = function (bounds, constraints) {
        this.initWithBounds(bounds);
        this.constraints = constraints;
        this.velocity = { x: 0, y: 0 };
        this.cor = 1;
        return this;
    };
    return BaseBody;
}(BaseSpatial_1.BaseSpatial));
exports.BaseBody = BaseBody;
//# sourceMappingURL=Body.js.map