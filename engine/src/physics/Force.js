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
exports.AreaForce = exports.ProximityForce = exports.PropulsionForce = exports.Force = exports.Impulse = void 0;
var Impulse = /** @class */ (function () {
    function Impulse(power, angle) {
        if (angle === void 0) { angle = 0; }
        this.power = power;
        this.angle = angle;
    }
    return Impulse;
}());
exports.Impulse = Impulse;
var Force = /** @class */ (function (_super) {
    __extends(Force, _super);
    function Force(power, angle, lifespan) {
        if (angle === void 0) { angle = 0; }
        if (lifespan === void 0) { lifespan = 0; }
        var _this = _super.call(this, power, angle) || this;
        _this.age = 0;
        _this.lifespan = lifespan;
        return _this;
    }
    return Force;
}(Impulse));
exports.Force = Force;
var PropulsionForce = /** @class */ (function (_super) {
    __extends(PropulsionForce, _super);
    function PropulsionForce() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PropulsionForce.prototype.initWithParentID = function (parentID) {
        this.parentID = parentID;
        return this;
    };
    return PropulsionForce;
}(Force));
exports.PropulsionForce = PropulsionForce;
var ProximityForce = /** @class */ (function (_super) {
    __extends(ProximityForce, _super);
    function ProximityForce() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProximityForce.prototype.initWithOriginAndRange = function (origin, range) {
        if (range === void 0) { range = 0; }
        this.origin = origin;
        this.range = range;
        return this;
    };
    return ProximityForce;
}(Force));
exports.ProximityForce = ProximityForce;
var AreaForce = /** @class */ (function (_super) {
    __extends(AreaForce, _super);
    function AreaForce() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AreaForce.prototype.initWithParentID = function (parentID) {
        this.parentID = parentID;
        return this;
    };
    return AreaForce;
}(Force));
exports.AreaForce = AreaForce;
//# sourceMappingURL=Force.js.map