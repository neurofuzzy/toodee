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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BodyBoundaryContact = exports.BodySegmentBodyContact = exports.BodyBodyContact = exports.BaseContact = exports.IContact = void 0;
exports.resolveContact = resolveContact;
var Helpers_1 = require("../geom/Helpers");
var IContact = /** @class */ (function () {
    function IContact() {
    }
    return IContact;
}());
exports.IContact = IContact;
var BaseContact = /** @class */ (function () {
    function BaseContact(penetration, itemA, itemB, corAB) {
        if (corAB === void 0) { corAB = 1; }
        penetration = __assign({}, penetration);
        (0, Helpers_1.normalizePoint)(penetration);
        this.penetration = penetration;
        this.itemA = itemA;
        this.itemB = itemB;
        this.corAB = corAB;
    }
    return BaseContact;
}());
exports.BaseContact = BaseContact;
var BodyBodyContact = /** @class */ (function (_super) {
    __extends(BodyBodyContact, _super);
    function BodyBodyContact() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BodyBodyContact;
}(BaseContact));
exports.BodyBodyContact = BodyBodyContact;
var BodySegmentBodyContact = /** @class */ (function (_super) {
    __extends(BodySegmentBodyContact, _super);
    function BodySegmentBodyContact() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BodySegmentBodyContact;
}(BaseContact));
exports.BodySegmentBodyContact = BodySegmentBodyContact;
var BodyBoundaryContact = /** @class */ (function (_super) {
    __extends(BodyBoundaryContact, _super);
    function BodyBoundaryContact() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return BodyBoundaryContact;
}(BaseContact));
exports.BodyBoundaryContact = BodyBoundaryContact;
function resolveContact(contact) {
    var pen = contact.penetration;
    var iA = contact.itemA;
    var vA = iA.velocity;
    if (contact instanceof BodyBodyContact) {
        var iB = contact.itemB;
        var vB = iB.velocity;
        (0, Helpers_1.scalePoint)(vA, contact.corAB);
        (0, Helpers_1.scalePoint)(vB, contact.corAB);
        if (iA.bounds.shape == Helpers_1.SHAPE_ROUND && iB.bounds.shape == Helpers_1.SHAPE_ROUND) {
            var aA = iA.bounds.anchor;
            var aB = iB.bounds.anchor;
            var angle = (0, Helpers_1.angleBetween)(aA.x, aA.y, aB.x, aB.y);
            (0, Helpers_1.rotatePoint)(vA, angle);
            (0, Helpers_1.rotatePoint)(vB, angle);
            var vt = vA.x;
            vA.x = 0 - vB.x;
            vB.x = vt;
            (0, Helpers_1.rotatePoint)(vA, 0 - angle);
            (0, Helpers_1.rotatePoint)(vB, 0 - angle);
        }
        else if (iA.bounds.shape == Helpers_1.SHAPE_ROUND && iB.bounds.shape == Helpers_1.SHAPE_ORTHO) {
            var vAx = vA.x;
            var vAy = vA.y;
            if (pen.x == 0) {
                vA.y = 0 - vAy;
            }
            if (pen.y == 0) {
                vA.x = 0 - vAx;
            }
            if (pen.x != 0 && pen.y != 0) {
                var vel = (0, Helpers_1.distanceBetween)(0, 0, vAx, vAy);
                vA.x = pen.x * vel;
                vA.y = pen.y * vel;
            }
        }
    }
    else if (contact instanceof BodyBoundaryContact) {
        var iB = contact.itemB;
        var angle = (0, Helpers_1.angleBetween)(iB.ptA.x, iB.ptA.y, iB.ptB.x, iB.ptB.y);
        (0, Helpers_1.rotatePoint)(vA, angle);
        vA.y = 0 - vA.y * contact.corAB;
        (0, Helpers_1.rotatePoint)(vA, 0 - angle);
    }
    else if (contact instanceof BodySegmentBodyContact) {
        var iB = contact.itemB;
        if (iB.isBoundary) {
            var angle = (0, Helpers_1.angleBetween)(iB.ray.ptA.x, iB.ray.ptA.y, iB.ray.ptB.x, iB.ray.ptB.y);
            (0, Helpers_1.rotatePoint)(vA, angle);
            vA.y = 0 - vA.y * contact.corAB;
            (0, Helpers_1.rotatePoint)(vA, 0 - angle);
        }
        else {
            var aA = iA.bounds.anchor;
            var hp = contact.hitPoint;
            var angle = (0, Helpers_1.angleBetween)(aA.x, aA.y, hp.pt.x, hp.pt.y);
            (0, Helpers_1.rotatePoint)(vA, angle);
            vA.x -= iB.pressure;
            (0, Helpers_1.rotatePoint)(vA, 0 - angle);
        }
    }
}
//# sourceMappingURL=Contact.js.map