"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API = void 0;
var Projectile_1 = require("./Projectile");
var Beam_1 = require("./Beam");
var BaseGeom_1 = require("../geom/BaseGeom");
var Helpers_1 = require("../geom/Helpers");
var API = /** @class */ (function () {
    function API(model, bodyGrid, boundaryGrid, bodyBoundaryMap, forces, dispatcher) {
        this.model = model;
        this.bodyGrid = bodyGrid;
        this.boundaryGrid = boundaryGrid;
        this.bodyBoundaryMap = bodyBoundaryMap;
        this.forces = forces;
        this.dispatcher = dispatcher;
        return this;
    }
    /**
     * Adds a listener function to receive events when objects are added or removed from a model
     * @param listener IEventListenerFunc<Entity | Projectile | Boundary | Beam>
     * @param scope scope object to use as _this_
     */
    API.prototype.addModelListener = function (listener, scope) {
        this.model.bodies.addListener(listener, scope);
        this.model.projectiles.addListener(listener, scope);
        this.model.boundaries.addListener(listener, scope);
        this.model.beams.addListener(listener, scope);
    };
    /**
     * Adds a listener function to receive events when objects make contact with eachother or boundaries
     * @param listener IEventListenerFunc<Entity | Projectile | Boundary | Beam>
     * @param scope scope object to use as _this_
     */
    API.prototype.addContactListener = function (listener, scope) {
        this.dispatcher.addListener(listener, scope);
    };
    /**
     * Adds a listener function to receive events when object enter or leave boundary areas
     * @param listener IEventListenerFunc<T>
     * @param scope scope object to use as _this_
     */
    API.prototype.addBoundaryCrossListener = function (listener, scope) {
        this.bodyBoundaryMap.addListener(listener, scope);
    };
    /**
     * Adds a force to the simulation
     * @param force
     */
    API.prototype.addForce = function (force) {
        this.forces.push(force);
    };
    API.prototype.applyImpulse = function (toEntity, x, y) {
        toEntity.velocity.x += x;
        toEntity.velocity.y += y;
    };
    /**
     * Removes forces that act on a particular id
     * @param id
     */
    API.prototype.removeForcesByParentID = function (id) {
        var i = this.forces.length;
        while (i--) {
            var force = this.forces[i];
            if (force.parentID == id) {
                this.forces.splice(i, 1);
            }
        }
    };
    /**
     * Finds bodies near a point
     * @param focusPt point to check nearness
     * @param range how far is near
     */
    API.prototype.bodiesNear = function (focalPt, range) {
        return this.bodyGrid.getItemsNear(focalPt, range);
    };
    /**
     * Finds bodies near another body, filtering out bodies not in front. Useful for sight-based AI
     * @param focusPt focal point
     * @param range near range
     * @param facingAngle
     * @param withinAngle angle delta from front
     */
    API.prototype.bodiesNearAndInFront = function (focalPt, range, facingAngle, withinAngle) {
        if (withinAngle === void 0) { withinAngle = 0.5; }
        var frontBodies = [];
        var nearItems = this.bodiesNear(focalPt, range);
        nearItems.forEach(function (bodyB) {
            var ptB = bodyB.bounds.anchor;
            var ang = (0, Helpers_1.normalizeAngle)(0 - (0, Helpers_1.angleBetween)(focalPt.x, focalPt.y, ptB.x, ptB.y) + Math.PI * 0.5);
            var angDelta = (0, Helpers_1.normalizeAngle)(facingAngle - ang);
            if (Math.abs(angDelta) < withinAngle) {
                frontBodies.push(bodyB);
            }
        });
        return frontBodies;
    };
    /**
     * Projects a ray and returns a list of bodies that intersect, closest first
     * @param ray a ray to project
     */
    API.prototype.raycast = function (ray) {
        var hitPts = [];
        var coords = (0, Helpers_1.cellCoordsAlongLineWithThickness)(ray.ptA.x, ray.ptA.y, ray.ptB.x, ray.ptB.y, 100, 20);
        var boundaryCells = this.boundaryGrid.getCellsFromCoords(coords, true);
        boundaryCells.forEach(function (cell) {
            cell.forEach(function (seg) {
                var intPt = (0, Helpers_1.lineLineIntersect)(ray.ptA.x, ray.ptA.y, ray.ptB.x, ray.ptB.y, seg.ptA.x, seg.ptA.y, seg.ptB.x, seg.ptB.y);
                if (intPt != null) {
                    hitPts.push(new Helpers_1.PointHit(ray.ptA, intPt, seg.parentID, Helpers_1.HIT_TYPE_SEGMENT));
                }
            });
        });
        var bodyCells = this.bodyGrid.getCellsFromCoords(coords, true);
        bodyCells.forEach(function (cell) {
            cell.forEach(function (body) {
                var intPts = (0, Helpers_1.boundsLineIntersect)(body.bounds, ray.ptA, ray.ptB);
                if (intPts && intPts.length) {
                    intPts.forEach(function (intPt) {
                        var item = body;
                        hitPts.push(new Helpers_1.PointHit(ray.ptA, intPt, item.id, Helpers_1.HIT_TYPE_SHAPE));
                    });
                }
            });
        });
        if (hitPts.length > 0) {
            Helpers_1.PointHit.sort(hitPts);
        }
        return hitPts;
    };
    API.prototype.launchFrom = function (item, speed, angle, projectile) {
        if (speed === void 0) { speed = 3; }
        if (angle === void 0) { angle = NaN; }
        if (projectile === void 0) { projectile = null; }
        if (isNaN(angle)) {
            angle = item.rotation;
        }
        if (projectile == null) {
            projectile = new Projectile_1.Projectile();
        }
        var pos = item.bounds.anchor.clone();
        projectile.initWithPositionSizeAndLifespan(pos, 5, 360);
        projectile.parentID = item.id;
        var vel = new BaseGeom_1.Point(speed, 0);
        (0, Helpers_1.rotatePoint)(vel, angle);
        var bv = projectile.velocity;
        var iv = item.velocity;
        bv.x = vel.x;
        bv.y = vel.y;
        if (bv.x > 0) {
            bv.x = Math.max(bv.x, bv.x + iv.x);
        }
        else {
            bv.x = Math.min(bv.x, bv.x + iv.x);
        }
        if (bv.y > 0) {
            bv.y = Math.max(bv.y, bv.y + iv.y);
        }
        else {
            bv.y = Math.min(bv.y, bv.y + iv.y);
        }
        //maxPoint(projectile.velocity, 3);
        this.model.projectiles.addItem(projectile);
        return projectile;
    };
    API.prototype.launchFromWithDeltaXY = function (item, speed, deltaX, deltaY, projectile) {
        if (speed === void 0) { speed = 3; }
        if (deltaX === void 0) { deltaX = 0; }
        if (deltaY === void 0) { deltaY = 0; }
        if (projectile === void 0) { projectile = null; }
        var angle = (0, Helpers_1.normalizeAngle)(0 - (0, Helpers_1.xyToAngle)(deltaX, deltaY));
        return this.launchFrom(item, speed, angle, projectile);
    };
    API.prototype.castFrom = function (item, range, beam) {
        if (range === void 0) { range = 500; }
        if (beam === void 0) { beam = null; }
        beam = new Beam_1.Beam();
        beam.initWithOriginAndAngle(item.bounds.anchor.x, item.bounds.anchor.y, item.rotation, range, item.id);
        beam.constrainRotationToParent = true;
        this.model.beams.addItem(beam);
        return beam;
    };
    return API;
}());
exports.API = API;
//# sourceMappingURL=API.js.map