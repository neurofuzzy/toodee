"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePenetrationBetweenBounds = resolvePenetrationBetweenBounds;
exports.getPenetrationSegmentRound = getPenetrationSegmentRound;
var BaseGeom_1 = require("./BaseGeom");
var Helpers_1 = require("./Helpers");
var pt = new BaseGeom_1.Point();
function getPenetrationBetweenBounds(bA, bB) {
    pt.x = pt.y = 0;
    if ((0, Helpers_1.boundsIntersect)(bA, bB)) {
        var aA = bA.anchor;
        var aB = bB.anchor;
        var dx = Math.abs(aA.x - aB.x) - bA.hw - bB.hw;
        var dy = Math.abs(aA.y - aB.y) - bA.hh - bB.hh;
        if (dx < 0) {
            pt.x = 0 - dx;
        }
        if (dy < 0) {
            pt.y = 0 - dy;
        }
    }
    return pt;
}
function getPenetrationRoundRound(bA, bB) {
    pt.x = pt.y = 0;
    var dist = (0, Helpers_1.distanceBetween)(bA.anchor.x, bA.anchor.y, bB.anchor.x, bB.anchor.y) - bA.hw - bB.hw;
    if (dist < 0) {
        var delta = 0 - dist;
        var angle = (0, Helpers_1.angleBetween)(bA.anchor.x, bA.anchor.y, bB.anchor.x, bB.anchor.y);
        if (angle < 0)
            angle += Math.PI * 2;
        pt.x = delta * Math.cos(angle);
        pt.y = delta * Math.sin(angle);
    }
    return pt;
}
function resolvePenetrationBetweenBounds(bA, bB, cA, cB, useShapes) {
    if (useShapes === void 0) { useShapes = false; }
    if (!useShapes || (bA.shape == Helpers_1.SHAPE_ORTHO && bB.shape == Helpers_1.SHAPE_ORTHO)) {
        var pt_1 = getPenetrationBetweenBounds(bA, bB);
        var aA = bA.anchor;
        var aB = bB.anchor;
        var hx = 0 - pt_1.x;
        var hy = 0 - pt_1.y;
        if (hx > hy) {
            if (aA.x < aB.x) {
                doResolve(hx, 0, bA, bB, cA, cB);
                return new BaseGeom_1.Point(hx, 0);
            }
            else {
                doResolve(0 - hx, 0, bA, bB, cA, cB);
                return new BaseGeom_1.Point(0 - hx, 0);
            }
        }
        else {
            if (aA.y < aB.y) {
                doResolve(0, hy, bA, bB, cA, cB);
                return new BaseGeom_1.Point(0, hy);
            }
            else {
                doResolve(0, 0 - hy, bA, bB, cA, cB);
                return new BaseGeom_1.Point(0, 0 - hy);
            }
        }
    }
    else if (bA.shape == bB.shape) {
        return resolvePenetrationRoundRound(bA, bB, cA, cB);
    }
    else {
        return resolvePenetrationOrthoRound(bA, bB, cA, cB);
    }
}
function resolvePenetrationRoundRound(bA, bB, cA, cB) {
    var pt = getPenetrationRoundRound(bA, bB);
    var deltaX = 0 - pt.x;
    var deltaY = 0 - pt.y;
    doResolve(deltaX, deltaY, bA, bB, cA, cB);
    return new BaseGeom_1.Point(deltaX, deltaY);
}
function resolvePenetrationOrthoRound(bA, bB, cA, cB) {
    var orthob = bA;
    var circleb = bB;
    var orthoc = cA;
    var circlec = cB;
    if (bA.shape > bB.shape) {
        orthob = bB;
        circleb = bA;
        orthoc = cB;
        circlec = cA;
    }
    var cx = circleb.anchor.x;
    var cy = circleb.anchor.y;
    var radius = circleb.hw;
    var cx1 = cx - radius;
    var cy1 = cy - radius;
    var cx2 = cx + radius;
    var cy2 = cy + radius;
    var rx = orthob.anchor.x;
    var ry = orthob.anchor.y;
    var rx1 = rx - orthob.hw;
    var ry1 = ry - orthob.hh;
    var rx2 = rx + orthob.hw;
    var ry2 = ry + orthob.hh;
    if (rx2 < cx1 || ry2 < cy1 || rx1 > cx2 || ry1 > cy2) {
        return;
    }
    var delta, angle;
    var forceX = false;
    if (rx2 > cx && ry2 > cy && rx1 < cx && ry1 < cy) {
        var aspect = orthob.hh / orthob.hw;
        if (Math.abs(cx - rx) * aspect > Math.abs(cy - ry) / aspect) {
            forceX = true;
        }
    }
    if (!forceX && cx >= rx1 && cx <= rx2) {
        if (cy <= ry) {
            delta = ry1 - cy - radius;
        }
        else {
            delta = ry2 - cy + radius;
        }
        doResolve(0, delta, circleb, orthob, circlec, orthoc);
        return new BaseGeom_1.Point(0, delta);
    }
    else if (cy >= ry1 && cy <= ry2) {
        if (cx <= rx) {
            delta = rx1 - cx - radius;
        }
        else {
            delta = rx2 - cx + radius;
        }
        doResolve(delta, 0, circleb, orthob, circlec, orthoc);
        return new BaseGeom_1.Point(delta, 0);
    }
    else if (cx < rx1 && cy < ry1) {
        delta = (0, Helpers_1.distanceBetween)(cx, cy, rx1, ry1);
        angle = (0, Helpers_1.angleBetween)(cx, cy, rx1, ry1);
    }
    else if (cx > rx2 && cy < ry1) {
        delta = (0, Helpers_1.distanceBetween)(cx, cy, rx2, ry1);
        angle = (0, Helpers_1.angleBetween)(cx, cy, rx2, ry1);
    }
    else if (cx > rx2 && cy > ry2) {
        delta = (0, Helpers_1.distanceBetween)(cx, cy, rx2, ry2);
        angle = (0, Helpers_1.angleBetween)(cx, cy, rx2, ry2);
    }
    else {
        delta = (0, Helpers_1.distanceBetween)(cx, cy, rx1, ry2);
        angle = (0, Helpers_1.angleBetween)(cx, cy, rx1, ry2);
    }
    if (angle < 0)
        angle += Math.PI * 2;
    if (delta < radius) {
        delta -= radius;
        var deltaX = delta * Math.cos(angle);
        var deltaY = delta * Math.sin(angle);
        doResolve(deltaX, deltaY, circleb, orthob, circlec, orthoc);
        return new BaseGeom_1.Point(deltaX, deltaY);
    }
}
function getPenetrationSegmentRound(segPtA, segPtB, b, resolve, twoSidedSegment) {
    if (twoSidedSegment === void 0) { twoSidedSegment = false; }
    var a = b.anchor;
    var closestPt = (0, Helpers_1.closestPtPointLine)(a, segPtA, segPtB);
    var delta = (0, Helpers_1.distanceBetween)(a.x, a.y, closestPt.x, closestPt.y);
    delta -= b.hw;
    if (delta < 0) {
        if (delta < 0 - b.hw) {
            //  delta += b.hw * 2;
        }
        var angle = (0, Helpers_1.angleBetween)(a.x, a.y, closestPt.x, closestPt.y);
        var dx = delta * Math.sin(Math.PI * 0.5 - angle);
        var dy = delta * Math.cos(Math.PI * 0.5 - angle);
        if (!twoSidedSegment) {
            var lsNew = (0, Helpers_1.lineSide)(a.x + dx, a.y + dy, segPtA.x, segPtA.y, segPtB.x, segPtB.y);
            if (lsNew != 1) {
                dx = 0 - dx;
                dy = 0 - dy;
            }
        }
        if (resolve) {
            a.x += dx;
            a.y += dy;
        }
        return new BaseGeom_1.Point(dx, dy);
    }
    return null;
}
function doResolve(deltaX, deltaY, bA, bB, cA, cB) {
    var aA = bA.anchor;
    var aB = bB.anchor;
    if (deltaX != 0 && (cA.lockX == false || cB.lockX == false)) {
        if (cA.lockX == cB.lockX) {
            aA.x += deltaX * 0.5;
            aB.x -= deltaX * 0.5;
        }
        else if (cA.lockX) {
            aB.x -= deltaX;
        }
        else {
            aA.x += deltaX;
        }
    }
    if (deltaY != 0 && (cA.lockY == false || cB.lockY == false)) {
        if (cA.lockY == cB.lockY) {
            aA.y += deltaY * 0.5;
            aB.y -= deltaY * 0.5;
        }
        else if (cA.lockY) {
            aB.y -= deltaY;
        }
        else {
            aA.y += deltaY;
        }
    }
}
//# sourceMappingURL=Penetration.js.map