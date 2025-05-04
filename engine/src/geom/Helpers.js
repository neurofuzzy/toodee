"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HIT_TYPE_SEGMENT = exports.HIT_TYPE_SHAPE = exports.SHAPE_ROUND = exports.SHAPE_ORTHO = exports.PointHit = void 0;
exports.pointWithinBounds = pointWithinBounds;
exports.boundsWithinBounds = boundsWithinBounds;
exports.boundsIntersect = boundsIntersect;
exports.pointWithinRectangle = pointWithinRectangle;
exports.rectangleWithinRectangle = rectangleWithinRectangle;
exports.rectIntersectsRect = rectIntersectsRect;
exports.distanceBetween = distanceBetween;
exports.distanceBetweenSquared = distanceBetweenSquared;
exports.angleBetween = angleBetween;
exports.xyToAngle = xyToAngle;
exports.orthoRoundBoundsIntersect = orthoRoundBoundsIntersect;
exports.rotatePointDeg = rotatePointDeg;
exports.rotatePoint = rotatePoint;
exports.scalePoint = scalePoint;
exports.lerp = lerp;
exports.lerpDist = lerpDist;
exports.normalizePoint = normalizePoint;
exports.maxPoint = maxPoint;
exports.normalizeAngle = normalizeAngle;
exports.normalizeAngleDeg = normalizeAngleDeg;
exports.dot = dot;
exports.length = length;
exports.cross = cross;
exports.sub = sub;
exports.add = add;
exports.closestPtPointLine = closestPtPointLine;
exports.ccw = ccw;
exports.lineIntersectsLine = lineIntersectsLine;
exports.lineLineIntersect = lineLineIntersect;
exports.lineSide = lineSide;
exports.boundsLineIntersect = boundsLineIntersect;
exports.circleLineIntersect = circleLineIntersect;
exports.rectLineIntersect = rectLineIntersect;
exports.cellCoordsAlongLine = cellCoordsAlongLine;
exports.cellCoordsAlongLineWithThickness = cellCoordsAlongLineWithThickness;
exports.cellCoordsContainingPolygon = cellCoordsContainingPolygon;
exports.cellCoordsIntersectingCircle = cellCoordsIntersectingCircle;
exports.polygonArea = polygonArea;
exports.polygonIsClockwise = polygonIsClockwise;
exports.linePolygonIntersect = linePolygonIntersect;
exports.pointInPolygon = pointInPolygon;
exports.polygonInPolygon = polygonInPolygon;
exports.resolvePenetrationBetweenBounds = resolvePenetrationBetweenBounds;
exports.getPenetrationSegmentRound = getPenetrationSegmentRound;
exports.resolvePenetrationOrthoRound = resolvePenetrationOrthoRound;
var BaseGeom_1 = require("./BaseGeom");
var PointHit = /** @class */ (function () {
    function PointHit(origin, hitPoint, parentID, type) {
        if (parentID === void 0) { parentID = -1; }
        if (type === void 0) { type = 0; }
        this.pt = hitPoint;
        if (origin) {
            this.angle = angleBetween(origin.x, origin.y, hitPoint.x, hitPoint.y);
            this.dist = distanceBetween(origin.x, origin.y, hitPoint.x, hitPoint.y);
        }
        this.parentID = parentID;
        this.type = type;
    }
    PointHit.sort = function (ptHits) {
        ptHits.sort(function (a, b) {
            if (a.dist > b.dist) {
                return 1;
            }
            else if (a.dist < b.dist) {
                return -1;
            }
            return 0;
        });
    };
    PointHit.prototype.clone = function () {
        var ph = new PointHit(this.pt.clone(), this.pt.clone(), this.parentID);
        ph.angle = this.angle;
        ph.dist = this.dist;
        return ph;
    };
    return PointHit;
}());
exports.PointHit = PointHit;
exports.SHAPE_ORTHO = 0;
exports.SHAPE_ROUND = 1;
exports.HIT_TYPE_SHAPE = 2;
exports.HIT_TYPE_SEGMENT = 3;
function pointWithinBounds(x, y, b) {
    var a = b.anchor;
    return (x >= a.x - b.hw &&
        y >= a.y - b.hh &&
        x <= a.x + b.hw &&
        y <= a.y + b.hh);
}
function boundsWithinBounds(bA, bB) {
    var aA = bA.anchor;
    var aB = bB.anchor;
    return (aA.x - bA.hw >= aB.x - bB.hw &&
        aA.y - bA.hh >= aB.y - bB.hh &&
        aA.x + bA.hw <= aB.x + bB.hw &&
        aA.y + bA.hh <= aB.y + bB.hh);
}
function boundsIntersect(bA, bB, useShapes) {
    if (useShapes === void 0) { useShapes = false; }
    var aA = bA.anchor;
    var aB = bB.anchor;
    var orthoIntersects = (aA.x + bA.hw >= aB.x - bB.hw &&
        aA.y + bA.hh >= aB.y - bB.hh &&
        aA.x - bA.hw <= aB.x + bB.hw &&
        aA.y - bA.hh <= aB.y + bB.hh);
    if (!useShapes || (bA.shape == exports.SHAPE_ORTHO && bB.shape == exports.SHAPE_ORTHO)) {
        return orthoIntersects;
    }
    else if (bA.shape == bB.shape) {
        if (orthoIntersects) {
            return distanceBetweenSquared(bA.anchor.x, bA.anchor.y, bB.anchor.x, bB.anchor.y) < (bA.hw + bB.hw) * (bA.hw + bB.hw);
        }
    }
    else {
        if (orthoIntersects) {
            return orthoRoundBoundsIntersect(bA, bB);
        }
    }
    return false;
}
function pointWithinRectangle(x, y, rect, tilescale) {
    if (tilescale === void 0) { tilescale = 1; }
    return (x >= rect.x1 &&
        y >= rect.y1 &&
        x <= rect.x2 &&
        y <= rect.y2);
}
function rectangleWithinRectangle(rectA, rectB) {
    return (rectA.x1 >= rectB.x1 &&
        rectA.y1 >= rectB.y1 &&
        rectA.x2 <= rectB.x2 &&
        rectA.y2 <= rectB.y2);
}
function rectIntersectsRect(rectA, rectB) {
    return (rectA.x2 >= rectB.x1 &&
        rectA.y2 >= rectB.y1 &&
        rectA.x1 <= rectB.x2 &&
        rectA.y1 <= rectB.y2);
}
function distanceBetween(x1, y1, x2, y2) {
    return Math.sqrt(distanceBetweenSquared(x1, y1, x2, y2));
}
function distanceBetweenSquared(x1, y1, x2, y2) {
    var dx = x2 - x1, dy = y2 - y1;
    return dx * dx + dy * dy;
}
function angleBetween(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
}
function xyToAngle(x, y) {
    return Math.atan2(y, x);
}
function orthoRoundBoundsIntersect(bA, bB) {
    var orthob = bA;
    var circleb = bB;
    if (bA.shape > bB.shape) {
        orthob = bB;
        circleb = bA;
    }
    var cx = circleb.anchor.x;
    var cy = circleb.anchor.y;
    var radius = circleb.hw;
    var cx1 = cx - radius;
    var cy1 = cy - radius;
    var cx2 = cx + radius;
    var cy2 = cy + radius;
    var rx1 = orthob.anchor.x - orthob.hw;
    var ry1 = orthob.anchor.y - orthob.hh;
    var rx2 = orthob.anchor.x + orthob.hw;
    var ry2 = orthob.anchor.y + orthob.hh;
    if (rx2 < cx1 || ry2 < cy1 || rx1 > cx2 || ry1 > cy2) {
        return false;
    }
    if (rx2 > cx && ry2 > cy && rx1 < cx && ry1 < cy) {
        return true;
    }
    var delta, angle;
    if (cx >= rx1 && cx <= rx2) {
        return true;
    }
    else if (cy >= ry1 && cy <= ry2) {
        return true;
    }
    else if (cx < rx1 && cy < ry1) {
        delta = distanceBetween(cx, cy, rx1, ry1);
        angle = angleBetween(cx, cy, rx1, ry1);
    }
    else if (cx > rx2 && cy < ry1) {
        delta = distanceBetween(cx, cy, rx2, ry1);
        angle = angleBetween(cx, cy, rx2, ry1);
    }
    else if (cx > rx2 && cy > ry2) {
        delta = distanceBetween(cx, cy, rx2, ry2);
        angle = angleBetween(cx, cy, rx2, ry2);
    }
    else {
        delta = distanceBetween(cx, cy, rx1, ry2);
        angle = angleBetween(cx, cy, rx1, ry2);
    }
    if (angle < 0)
        angle += Math.PI * 2;
    return delta < radius;
}
function rotatePointDeg(pt, deg) {
    rotatePoint(pt, deg * Math.PI / 180);
}
function rotatePoint(pt, angle) {
    angle = 0 - normalizeAngle(angle);
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var oldX = pt.x;
    var oldY = pt.y;
    pt.x = cos * oldX - sin * oldY;
    pt.y = sin * oldX + cos * oldY;
}
function scalePoint(pt, scale) {
    pt.x *= scale;
    pt.y *= scale;
}
function lerp(a, b, t) {
    t = Math.max(0, Math.min(1, t));
    return a + (b - a) * t;
}
function lerpDist(x1, y1, x2, y2, dist) {
    var len = distanceBetween(x1, y1, x2, y2);
    var perc = dist / len;
    return new BaseGeom_1.Point(lerp(x2, x1, perc), lerp(y2, y1, perc));
}
function normalizePoint(pt, scale) {
    if (scale === void 0) { scale = 1; }
    var len = distanceBetween(0, 0, pt.x, pt.y);
    if (len != 0) {
        pt.x /= len / scale;
        pt.y /= len / scale;
    }
}
function maxPoint(pt, min) {
    var len = Math.sqrt(pt.x * pt.x + pt.y * pt.y);
    if (len < min) {
        normalizePoint(pt, min);
    }
}
function normalizeAngle(ang) {
    while (ang < 0)
        ang += Math.PI * 2;
    while (ang >= Math.PI * 2)
        ang -= Math.PI * 2;
    return ang;
}
function normalizeAngleDeg(ang) {
    while (ang < -180) {
        ang += 360;
    }
    while (ang > 180) {
        ang -= 360;
    }
    return ang;
}
function dot(ptA, ptB) {
    return ptA.x * ptB.x + ptA.y * ptB.y;
}
function length(pt) {
    return Math.sqrt(pt.x * pt.x + pt.y * pt.y);
}
function cross(ptA, ptB) {
    return ptA.x * ptB.y - ptA.y * ptB.x;
}
function sub(ptA, ptB) {
    return new BaseGeom_1.Point(ptA.x - ptB.x, ptA.y - ptB.y);
}
function add(ptA, ptB) {
    return new BaseGeom_1.Point(ptA.x + ptB.x, ptA.y + ptB.y);
}
function closestPtPointLine(ptC, ptA, ptB) {
    var pt;
    var ab = sub(ptB, ptA);
    var ca = sub(ptC, ptA);
    var t = dot(ca, ab);
    if (t < 0) {
        pt = ptA;
    }
    else {
        var denom = dot(ab, ab);
        if (t >= denom) {
            pt = ptB;
        }
        else {
            t /= denom;
            ca.x = ptA.x + t * ab.x;
            ca.y = ptA.y + t * ab.y;
            pt = ca;
        }
    }
    return pt;
}
function ccw(p1x, p1y, p2x, p2y, p3x, p3y) {
    return (p3y - p1y) * (p2x - p1x) > (p2y - p1y) * (p3x - p1x);
}
function lineIntersectsLine(p1x, p1y, p2x, p2y, p3x, p3y, p4x, p4y) {
    var fn = ccw;
    return (fn(p1x, p1y, p3x, p3y, p4x, p4y) != fn(p2x, p2y, p3x, p3y, p4x, p4y) &&
        fn(p1x, p1y, p2x, p2y, p3x, p3y) != fn(p1x, p1y, p2x, p2y, p4x, p4y));
}
function lineLineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = x2 - x1;
    s1_y = y2 - y1;
    s2_x = x4 - x3;
    s2_y = y4 - y3;
    var s, t;
    s = (-s1_y * (x1 - x3) + s1_x * (y1 - y3)) / (-s2_x * s1_y + s1_x * s2_y);
    t = (s2_x * (y1 - y3) - s2_y * (x1 - x3)) / (-s2_x * s1_y + s1_x * s2_y);
    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        var atX = x1 + (t * s1_x);
        var atY = y1 + (t * s1_y);
        return new BaseGeom_1.Point(atX, atY);
    }
    return null;
}
function lineSide(x, y, x1, y1, x2, y2) {
    return (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1) > 0 ? 1 : -1;
}
function boundsLineIntersect(b, segPtA, segPtB) {
    if (b.shape == exports.SHAPE_ROUND) {
        return circleLineIntersect(b, segPtA, segPtB);
    }
    else {
        return rectLineIntersect(b, segPtA, segPtB);
    }
}
function circleLineIntersect(bnds, segPtA, segPtB) {
    var intPts = [];
    var cx = bnds.anchor.x;
    var cy = bnds.anchor.y;
    var r = bnds.hw;
    var x1 = segPtA.x;
    var y1 = segPtA.y;
    var x2 = segPtB.x;
    var y2 = segPtB.y;
    var a = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    var b = 2 * ((x2 - x1) * (x1 - cx) + (y2 - y1) * (y1 - cy));
    var cc = cx * cx + cy * cy + x1 * x1 + y1 * y1 - 2 * (cx * x1 + cy * y1) - r * r;
    var d = b * b - 4 * a * cc;
    if (d > 0) {
        var e = Math.sqrt(d);
        var u1 = (-b + e) / (2 * a);
        var u2 = (-b - e) / (2 * a);
        if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
            // do nothing
        }
        else {
            if (0 <= u2 && u2 <= 1) {
                intPts.push(new BaseGeom_1.Point(lerp(x1, x2, u2), lerp(y1, y2, u2)));
            }
            if (0 <= u1 && u1 <= 1) {
                intPts.push(new BaseGeom_1.Point(lerp(x1, x2, u1), lerp(y1, y2, u1)));
            }
        }
    }
    return intPts.length > 0 ? intPts : null;
}
function rectLineIntersect(b, segPtA, segPtB, side) {
    var ax = segPtA.x;
    var ay = segPtA.y;
    var bx = segPtB.x;
    var by = segPtB.y;
    var rx = b.anchor.x - b.hw;
    var ry = b.anchor.y - b.hh;
    var rx2 = rx + b.hw * 2;
    var ry2 = ry + b.hh * 2;
    if ((rx > ax && rx > bx) || (ry > ay && ry > by)) {
        return null;
    }
    if ((rx2 < ax && rx2 < bx) || (ry2 < ay && ry2 < by)) {
        return null;
    }
    var fn = lineIntersectsLine;
    var fn2 = lineSide;
    var hits = [];
    if (fn(ax, ay, bx, by, rx, ry, rx2, ry)) {
        if (typeof side !== 'number' || isNaN(side) || fn2(ax, ay, rx, ry, rx2, ry) == side) {
            hits.push(lineLineIntersect(ax, ay, bx, by, rx, ry, rx2, ry));
        }
    }
    if (fn(ax, ay, bx, by, rx2, ry, rx2, ry2)) {
        if (typeof side !== 'number' || isNaN(side) || fn2(ax, ay, rx2, ry, rx2, ry2) == side) {
            hits.push(lineLineIntersect(ax, ay, bx, by, rx2, ry, rx2, ry2));
        }
    }
    if (fn(ax, ay, bx, by, rx2, ry2, rx, ry2)) {
        if (typeof side !== 'number' || isNaN(side) || fn2(ax, ay, rx2, ry2, rx, ry2) == side) {
            hits.push(lineLineIntersect(ax, ay, bx, by, rx2, ry2, rx, ry2));
        }
    }
    if (fn(ax, ay, bx, by, rx, ry2, rx, ry)) {
        if (typeof side !== 'number' || isNaN(side) || fn2(ax, ay, rx, ry2, rx, ry) == side) {
            hits.push(lineLineIntersect(ax, ay, bx, by, rx, ry2, rx, ry));
        }
    }
    var filteredHits = hits.filter(function (h) { return h !== null; });
    return filteredHits.length > 0 ? filteredHits : null;
}
function cellCoordsAlongLine(x0, y0, x1, y1, gridSize, intoArr) {
    if (gridSize === void 0) { gridSize = 20; }
    intoArr = intoArr || [];
    var minx = Math.floor(Math.min(x0, x1) / gridSize);
    var maxx = Math.floor(Math.max(x0, x1) / gridSize);
    var miny = Math.floor(Math.min(y0, y1) / gridSize);
    var maxy = Math.floor(Math.max(y0, y1) / gridSize);
    var sides = [];
    for (var j = miny; j <= maxy + 1; j++) {
        sides[j] = [];
        for (var i = minx; i <= maxx + 1; i++) {
            sides[j][i] = lineSide(i * gridSize, j * gridSize, x0, y0, x1, y1);
        }
    }
    for (var j = miny; j <= maxy; j++) {
        for (var i = minx; i <= maxx; i++) {
            if (Math.abs(sides[j][i] + sides[j][i + 1] + sides[j + 1][i + 1] + sides[j + 1][i]) != 4) {
                intoArr.push(new BaseGeom_1.Point(i, j));
            }
        }
    }
    return intoArr;
}
function cellCoordsAlongLineWithThickness(x0, y0, x1, y1, gridSize, thickness, intoArr) {
    if (gridSize === void 0) { gridSize = 20; }
    if (thickness === void 0) { thickness = 0; }
    if (thickness == 0) {
        return cellCoordsAlongLine(x0, y0, x1, y1, gridSize, intoArr);
    }
    else {
        intoArr = cellCoordsAlongLine(x0, y0, x1, y1, gridSize, intoArr);
        var angle = angleBetween(x0, y0, x1, y1);
        var sinang = Math.sin(0 - angle);
        var cosang = Math.cos(0 - angle);
        x0 += sinang * thickness;
        y0 += cosang * thickness;
        x1 += sinang * thickness;
        y1 += cosang * thickness;
        intoArr = cellCoordsAlongLine(x0, y0, x1, y1, gridSize, intoArr);
        x0 -= sinang * thickness * 2;
        y0 -= cosang * thickness * 2;
        x1 -= sinang * thickness * 2;
        y1 -= cosang * thickness * 2;
        intoArr = cellCoordsAlongLine(x0, y0, x1, y1, gridSize, intoArr);
        return intoArr;
    }
}
function cellCoordsContainingPolygon(poly, gridSize, padding) {
    if (padding === void 0) { padding = 0; }
    var intoArr = [];
    var plen = poly.segments.length;
    for (var i = 0; i < plen; i++) {
        var seg = poly.segments[i];
        cellCoordsAlongLineWithThickness(seg.ptA.x, seg.ptA.y, seg.ptB.y, seg.ptB.y, gridSize, padding, intoArr);
    }
    return intoArr;
}
function cellCoordsIntersectingCircle(center, radius, gridSize) {
    var a = [];
    radius += gridSize * 0.5 * 1.4142;
    var minx = Math.floor((center.x - radius) / gridSize);
    var maxx = Math.ceil((center.x + radius) / gridSize);
    var miny = Math.floor((center.y - radius) / gridSize);
    var maxy = Math.ceil((center.y + radius) / gridSize);
    var testPt = { x: 0, y: 0 };
    var hg = gridSize * 0.5;
    for (var y = miny; y <= maxy; y++) {
        for (var x = minx; x <= maxx; x++) {
            testPt.x = x * gridSize + hg;
            testPt.y = y * gridSize + hg;
            if (distanceBetween(center.x, center.y, testPt.x, testPt.y) < radius) {
                a.push(new BaseGeom_1.Point(x, y));
            }
        }
    }
    return a;
}
function polygonArea(pts) {
    var area = 0;
    for (var i = 0; i < pts.length; i++) {
        var ptA = pts[i];
        var ptB = pts[(i + 1) % pts.length];
        area += ptA.x * ptB.y;
        area -= ptB.x * ptA.y;
    }
    return area / 2;
}
function polygonIsClockwise(pts) {
    return polygonArea(pts) > 0;
}
function linePolygonIntersect(linePtA, linePtB, poly) {
    var pts = [];
    poly.segments.forEach(function (seg) {
        var intPt = lineLineIntersect(linePtA.x, linePtA.y, linePtB.x, linePtB.y, seg.ptA.x, seg.ptA.y, seg.ptB.x, seg.ptB.y);
        if (intPt != null) {
            pts.push(intPt);
        }
    });
    return pts.length > 0 ? pts : null;
}
function pointInPolygon(pt, poly) {
    if (!pointWithinRectangle(pt.x, pt.y, poly.boundingBox)) {
        return false;
    }
    var startPt = new BaseGeom_1.Point(poly.boundingBox.x1 - 100, poly.boundingBox.y1 - 100);
    var pts = linePolygonIntersect(startPt, pt, poly);
    if (!pts)
        return false;
    return !(pts.length % 2 == 0);
}
function polygonInPolygon(polyA, polyB) {
    if (!rectIntersectsRect(polyA.boundingBox, polyB.boundingBox)) {
        return false;
    }
    var startPt = new BaseGeom_1.Point(polyB.boundingBox.x1 - 100, polyB.boundingBox.y1 - 100);
    for (var i = 0; i < polyA.vertices.length; i++) {
        var pt = polyA.vertices[i];
        var pts = linePolygonIntersect(startPt, pt, polyB);
        if (!pts)
            return false;
        if (pts.length % 2 == 0) {
            return false;
        }
    }
    return true;
}
function resolvePenetrationBetweenBounds() { return null; }
function getPenetrationSegmentRound() { return null; }
function resolvePenetrationOrthoRound(bA, bB) { return undefined; }
//# sourceMappingURL=Helpers.js.map