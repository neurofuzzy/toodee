"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = exports.Segment = exports.Rectangle = exports.Ray = exports.Point = exports.Bounds = void 0;
var Helpers_1 = require("./Helpers");
var Bounds = /** @class */ (function () {
    function Bounds(x, y, hw, hh, shape) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        if (hw === void 0) { hw = 0; }
        if (hh === void 0) { hh = 0; }
        if (shape === void 0) { shape = 0; }
        this.anchor = new Point(x, y);
        this.hw = hw;
        this.hh = hh;
        this.shape = shape;
    }
    Bounds.prototype.clone = function () {
        return new Bounds(this.anchor.x, this.anchor.y, this.hw, this.hh, this.shape);
    };
    return Bounds;
}());
exports.Bounds = Bounds;
var Point = /** @class */ (function () {
    function Point(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Point.prototype.add = function (pt) {
        this.x += pt.x;
        this.y += pt.y;
    };
    Point.prototype.clone = function () {
        return new Point(this.x, this.y);
    };
    return Point;
}());
exports.Point = Point;
var Ray = /** @class */ (function () {
    function Ray(ox, oy, angle, length, parentID) {
        if (ox === void 0) { ox = 0; }
        if (oy === void 0) { oy = 0; }
        if (angle === void 0) { angle = 0; }
        if (length === void 0) { length = 100; }
        if (parentID === void 0) { parentID = -1; }
        this.ptA = new Point(ox, oy);
        this.ptB = new Point(ox, oy);
        this._angle = angle;
        this._length = length;
        this.parentID = parentID;
        this.projectRay();
    }
    Object.defineProperty(Ray.prototype, "angle", {
        get: function () {
            return this._angle;
        },
        set: function (val) {
            if (val != this._angle) {
                this._angle = (0, Helpers_1.normalizeAngle)(val);
                this.projectRay();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Ray.prototype, "length", {
        get: function () {
            return this._length;
        },
        set: function (val) {
            if (val != this._length) {
                this._length = Math.max(0, val);
                this.projectRay();
            }
        },
        enumerable: false,
        configurable: true
    });
    Ray.prototype.projectRay = function () {
        this.ptB.x = this.ptA.x + this.length * Math.sin(this.angle);
        this.ptB.y = this.ptA.y + this.length * Math.cos(this.angle);
    };
    Ray.prototype.align = function (withPosition, angle) {
        if (angle === void 0) { angle = this.angle; }
        this.ptA.x = withPosition.x;
        this.ptA.y = withPosition.y;
        this.angle = angle;
        this.projectRay();
    };
    Ray.prototype.clone = function () {
        return new Ray(this.ptA.x, this.ptA.y, this.angle, this.length, this.parentID);
    };
    return Ray;
}());
exports.Ray = Ray;
var Rectangle = /** @class */ (function () {
    function Rectangle(x1, x2, y1, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }
    Rectangle.prototype.clone = function () {
        return new Rectangle(this.x1, this.x2, this.y1, this.y2);
    };
    return Rectangle;
}());
exports.Rectangle = Rectangle;
var Segment = /** @class */ (function () {
    function Segment(ptA, ptB, parentID) {
        if (parentID === void 0) { parentID = -1; }
        this.ptA = ptA;
        this.ptB = ptB;
        this.parentID = parentID;
    }
    Segment.prototype.clone = function () {
        return new Segment(this.ptA.clone(), this.ptB.clone(), this.parentID);
    };
    return Segment;
}());
exports.Segment = Segment;
var Polygon = /** @class */ (function () {
    function Polygon(vertices) {
        this.vertices = vertices;
        this.segments = [];
        this.boundingBox = new Rectangle(100000, -100000, 100000, -100000);
        var b = this.boundingBox;
        for (var i = 0; i < vertices.length; i++) {
            var ptA = vertices[i];
            var ptB = vertices[(i + 1) % vertices.length];
            var seg = new Segment(ptA, ptB);
            this.segments.push(seg);
            b.x1 = Math.min(ptA.x, b.x1);
            b.x2 = Math.max(ptA.x, b.x2);
            b.y1 = Math.min(ptA.y, b.y1);
            b.y2 = Math.max(ptA.y, b.y2);
        }
        this.area = Math.abs((0, Helpers_1.polygonArea)(this.vertices));
        this.inverted = (0, Helpers_1.polygonIsClockwise)(this.vertices);
    }
    Polygon.prototype.clone = function () {
        var v = this.vertices.concat();
        return new Polygon(v);
    };
    return Polygon;
}());
exports.Polygon = Polygon;
//# sourceMappingURL=BaseGeom.js.map