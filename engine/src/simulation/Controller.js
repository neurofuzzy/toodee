"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Controller = exports.MAXVEL = exports.EventContext = void 0;
// Migrated from namespace Simulation to ES module
var SpatialGrid_1 = require("../geom/SpatialGrid");
var PolygonGrid_1 = require("../geom/PolygonGrid");
var SpatialPolygonMap_1 = require("../geom/SpatialPolygonMap");
var Helpers_1 = require("../geom/Helpers");
var Contact_1 = require("../physics/Contact");
var API_1 = require("./API");
var Pairing_1 = require("../util/Pairing");
var Events_1 = require("../models/Events");
var BaseGeom_1 = require("../geom/BaseGeom");
var Penetration_1 = require("../geom/Penetration");
var EventContext;
(function (EventContext) {
    EventContext[EventContext["Simulation"] = 1] = "Simulation";
    EventContext[EventContext["Boundary"] = 2] = "Boundary";
})(EventContext || (exports.EventContext = EventContext = {}));
exports.MAXVEL = 12;
var Controller = /** @class */ (function () {
    function Controller() {
        var _this = this;
        this.bodyBodyContacts = [];
        this.bodyBodyContactIndices = [];
        this.bodyBoundaryContacts = [];
        this.bodySegmentContactIndices = [];
        this.bodyBeamContacts = [];
        this.bodyBeamContactIndices = [];
        this.forces = [];
        this.update = function (secondPass) {
            _this.bodyBodyContacts = [];
            _this.bodyBoundaryContacts = [];
            _this.bodyBeamContacts = [];
            _this.bodyBodyContactIndices = [];
            _this.bodySegmentContactIndices = [];
            _this.bodyBeamContactIndices = [];
            var items = _this.model.bodies.items;
            // apply forces to velocities
            _this.applyForces();
            // apply velocities to positions
            _this.applyVelocities();
            // update cells
            items.forEach(function (item) {
                _this.bodyGrid.updateItem(item);
            });
            // body-body collision check
            items.forEach(function (item) {
                var itemA = item;
                var cells = _this.bodyGrid.getSurroundingCells(itemA);
                cells.forEach(function (cell) {
                    if (cell != null) {
                        cell.forEach(function (item) {
                            var itemB = item;
                            _this.getBodyBodyContacts(itemA, itemB);
                        });
                    }
                });
            });
            // body-boundary collision check
            items.forEach(function (item) {
                if (item.bounds.shape == Helpers_1.SHAPE_ROUND) {
                    var itemA_1 = item;
                    var cell = _this.boundaryGrid.getCellFromPoint(item.bounds.anchor);
                    if (cell) {
                        cell.forEach(function (seg) {
                            _this.getBodyBoundaryContacts(itemA_1, seg);
                        });
                    }
                }
            });
            // resolve accumulated contacts
            if (secondPass) {
                _this.bodyBodyContacts.reverse();
                _this.bodyBoundaryContacts.reverse();
                _this.bodyBeamContacts.reverse();
            }
            _this.bodyBodyContacts.forEach(function (contact) {
                (0, Contact_1.resolveContact)(contact);
            });
            _this.bodyBoundaryContacts.forEach(function (contact) {
                (0, Contact_1.resolveContact)(contact);
            });
            // projectiles
            var projectiles = _this.model.projectiles;
            projectiles.items.forEach(function (projectile) {
                projectile.age++;
                // if end of lifespan
                if (projectile.age > projectile.lifespan) {
                    _this.model.projectiles.removeItem(projectile);
                    return;
                }
                var polygon = _this.bodyBoundaryMap.getPolygonFromPoint(projectile.position, true);
                // if out of bounds
                if (!polygon) {
                    if (_this.dispatcher) {
                        _this.dispatcher.dispatch(Events_1.EventType.Contact, projectile, _this.bodyBoundaryMap.getOutermostPolygon(), 0);
                    }
                    _this.model.projectiles.removeItem(projectile);
                    return;
                }
                // masked out
                if (!(projectile.contactMask & polygon.contactMask)) {
                    return;
                }
                // out of bounds by inverted polygon
                if (polygon.inverted) {
                    if (projectile.resolveMask & polygon.resolveMask) {
                        if (_this.dispatcher) {
                            _this.dispatcher.dispatch(Events_1.EventType.Contact, projectile, polygon, 0);
                        }
                        _this.model.projectiles.removeItem(projectile);
                    }
                    return;
                }
                var hitItems = _this.bodyGrid.getItemsUnderPoint(projectile.position);
                // if hit an object
                if (hitItems.length > 0) {
                    var didHit_1 = false;
                    hitItems.forEach(function (item) {
                        if (!(projectile.contactMask & item.contactMask)) {
                            return;
                        }
                        if (projectile.parentID == item.id) {
                            return;
                        }
                        if (projectile.resolveMask & item.resolveMask) {
                            didHit_1 = true;
                            if (_this.dispatcher) {
                                _this.dispatcher.dispatch(Events_1.EventType.Contact, projectile, item, 0);
                            }
                        }
                    });
                    if (didHit_1) {
                        _this.model.projectiles.removeItem(projectile);
                    }
                    return;
                }
            });
            // beams
            var beams = _this.model.beams;
            beams.items.forEach(function (beam) {
                _this.alignBeam(beam);
                _this.getBodyBeamContacts(beam);
            });
            _this.bodyBeamContacts.forEach(function (contact) {
                (0, Contact_1.resolveContact)(contact);
            });
            // update cells and sectors
            // apply sector properties to body
            items.forEach(function (item) {
                _this.bodyGrid.updateItem(item);
                _this.bodyBoundaryMap.updateItem(item);
                var boundary = _this.bodyBoundaryMap.getPolygonByItemID(item.id);
                if (boundary) {
                    item.velocity.x *= 1 - boundary.drag;
                    item.velocity.y *= 1 - boundary.drag;
                }
            });
        };
    }
    Object.defineProperty(Controller.prototype, "api", {
        get: function () {
            return this._api;
        },
        enumerable: false,
        configurable: true
    });
    Controller.prototype.initWithModel = function (model) {
        this.model = model;
        this.reset();
        return this;
    };
    Controller.prototype.reset = function () {
        this.dispatcher = new Events_1.EventDispatcher().init();
        this.bodyGrid = new SpatialGrid_1.SpatialGrid(100).init();
        this.boundaryGrid = new PolygonGrid_1.PolygonGrid(100, 20).init();
        this.bodyBoundaryMap = new SpatialPolygonMap_1.SpatialPolygonMap().init();
        this.forces = [];
        this._api = new API_1.API(this.model, this.bodyGrid, this.boundaryGrid, this.bodyBoundaryMap, this.forces, this.dispatcher);
    };
    Controller.prototype.build = function () {
        // add items to grid
        for (var i = 0; i < this.model.bodies.items.size; i++) {
            this.bodyGrid.addItem(this.model.bodies.items[i]);
        }
        // add boundaries to grid
        for (var i = 0; i < this.model.boundaries.items.size; i++) {
            this.boundaryGrid.addItem(this.model.boundaries.items[i]);
        }
        // compare boundaries to find sectors
        for (var i = 0; i < this.model.boundaries.items.size; i++) {
            var boundary = this.model.boundaries.items[i];
            for (var j = 0; j < this.model.boundaries.items.size; j++) {
                var otherBoundary = this.model.boundaries.items[j];
                if (boundary != otherBoundary) {
                    if (!boundary.inverted && (0, Helpers_1.polygonInPolygon)(boundary, otherBoundary)) {
                        boundary.isSector = true;
                        break;
                    }
                }
            }
        }
        // add boundaries to body-boundary map
        var bs = [];
        for (var i = 0; i < this.model.boundaries.items.size; i++) {
            if (this.model.boundaries.items[i])
                bs.push(this.model.boundaries.items[i]);
        }
        for (var i = 0; i < bs.length; i++) {
            this.bodyBoundaryMap.addPolygon(bs[i]);
        }
    };
    Controller.prototype.start = function () {
        this.build();
    };
    Controller.prototype.getBodyBodyContacts = function (itemA, itemB) {
        if (itemA == itemB)
            return;
        if (!(itemA.contactMask & itemB.contactMask))
            return;
        var contactPairIdx = (0, Pairing_1.cantorPair)(itemA.id, itemB.id);
        if (itemA.bounds.shape == Helpers_1.SHAPE_ORTHO)
            return;
        if (this.bodyBodyContactIndices[contactPairIdx])
            return;
        if ((0, Helpers_1.boundsIntersect)(itemA.bounds, itemB.bounds, true)) {
            if (itemA.resolveMask & itemB.resolveMask) {
                var penetration = (0, Penetration_1.resolvePenetrationBetweenBounds)(itemA.bounds, itemB.bounds, itemA.cor, itemB.cor, true);
                this.bodyBodyContactIndices[contactPairIdx] = true;
                this.bodyBodyContacts.push(new Contact_1.BodyBodyContact(penetration, itemA, itemB, itemA.cor * itemB.cor));
            }
            if (this.dispatcher) {
                this.dispatcher.dispatch(Events_1.EventType.Contact, itemA, itemB);
            }
        }
        return;
    };
    Controller.prototype.getBodyBoundaryContacts = function (item, seg) {
        var parentPoly = this.model.boundaries.getItemByID(seg.parentID);
        if (parentPoly.isSector) {
            return;
        }
        if (!(item.contactMask & parentPoly.contactMask)) {
            return;
        }
        var contactPairIdx = (0, Pairing_1.cantorPair)(item.id, seg.id);
        if (this.bodySegmentContactIndices[contactPairIdx]) {
            return;
        }
        var resolve = (item.resolveMask & parentPoly.resolveMask) > 0;
        var penetration = (0, Penetration_1.getPenetrationSegmentRound)(seg.ptA, seg.ptB, item.bounds, resolve, true);
        this.bodySegmentContactIndices[contactPairIdx] = true;
        this.bodyBoundaryContacts.push(new Contact_1.BodyBoundaryContact(penetration, item, seg, item.cor * parentPoly.cor));
        if (this.dispatcher) {
            this.dispatcher.dispatch(Events_1.EventType.Contact, item, parentPoly);
        }
    };
    Controller.prototype.alignBeam = function (beam) {
        if (beam.parentID >= 0) {
            var parent_1 = this.model.bodies.getItemByID(beam.parentID);
            if (parent_1) {
                if (beam.constrainRotationToParent) {
                    beam.ray.align(parent_1.bounds.anchor, Math.PI - parent_1.rotation);
                }
                else {
                    beam.ray.align(parent_1.bounds.anchor); //, beam.ray.angle);
                }
            }
        }
    };
    Controller.prototype.getBodyBeamContacts = function (beam) {
        var _this = this;
        beam.hits = this._api.raycast(beam.ray);
        var beamTerminated = false;
        beam.hits.forEach(function (hit) {
            if (beamTerminated) {
                return;
            }
            if (hit.parentID == beam.parentID) {
                return;
            }
            if (hit.type == Helpers_1.HIT_TYPE_SEGMENT) {
                var boundary = _this.model.boundaries.getItemByID(hit.parentID);
                if (!boundary.isSector) {
                    beam.ray.ptB.x = hit.pt.x;
                    beam.ray.ptB.y = hit.pt.y;
                    if (_this.dispatcher) {
                        _this.dispatcher.dispatch(Events_1.EventType.Contact, beam, boundary, 0);
                    }
                    beamTerminated = true;
                    return;
                }
            }
            var item = _this.model.bodies.getItemByID(hit.parentID);
            if (item == null) {
                return;
            }
            if (!(item.contactMask & beam.contactMask)) {
                return;
            }
            var contactPairIdx = (0, Pairing_1.cantorPair)(item.id, beam.id);
            if (_this.bodyBeamContactIndices[contactPairIdx]) {
                return;
            }
            var resolve = beam.isBoundary && !beam.isSoft && ((item.resolveMask & beam.resolveMask) > 0);
            var penetration = (0, Penetration_1.getPenetrationSegmentRound)(beam.ray.ptA, beam.ray.ptB, item.bounds, resolve, true);
            _this.bodyBeamContactIndices[contactPairIdx] = true;
            var contact = new Contact_1.BodySegmentBodyContact(penetration, item, beam, item.cor * beam.cor);
            contact.hitPoint = hit;
            _this.bodyBeamContacts.push(contact);
            if (_this.dispatcher) {
                _this.dispatcher.dispatch(Events_1.EventType.Contact, beam, item);
            }
        });
    };
    Controller.prototype.applyPointAsForce = function (pt, body) {
        if (!body.constraints.lockX) {
            body.velocity.x += pt.x;
        }
        if (!body.constraints.lockY) {
            body.velocity.y += pt.y;
        }
    };
    Controller.prototype.applyForces = function () {
        var _this = this;
        var forcePt = new BaseGeom_1.Point();
        this.forces.forEach(function (force) {
            if (force instanceof Object && force.type === 'ProximityForce') {
                var bodies = _this.api.bodiesNear(force.origin, force.range);
                var ptA_1 = force.origin;
                bodies.forEach(function (body) {
                    if (body.bounds.anchor === force.origin) {
                        return;
                    }
                    var ptB = body.bounds.anchor;
                    var angle = 0 - (0, Helpers_1.angleBetween)(ptA_1.x, ptA_1.y, ptB.x, ptB.y);
                    forcePt.y = 0;
                    forcePt.x = force.power * 0.0166; // 60 frames per second
                    (0, Helpers_1.rotatePoint)(forcePt, force.angle);
                    (0, Helpers_1.rotatePoint)(forcePt, angle);
                    _this.applyPointAsForce(forcePt, body);
                });
            }
            else if (force instanceof Object && force.type === 'AreaForce') {
                var bodies = _this.bodyBoundaryMap.getItemsWithinPolygonID(force.parentID);
                if (bodies) {
                    forcePt.y = 0;
                    forcePt.x = force.power * 0.0166; // 60 frames per second
                    (0, Helpers_1.rotatePoint)(forcePt, force.angle);
                    bodies.forEach(function (body) {
                        _this.applyPointAsForce(forcePt, body);
                    });
                }
            }
            else if (force instanceof Object && force.type === 'PropulsionForce') {
                var body = _this.model.bodies.getItemByID(force.parentID);
                if (body) {
                    forcePt.y = 0;
                    forcePt.x = force.power * 0.0166; // 60 frames per second
                    (0, Helpers_1.rotatePoint)(forcePt, force.angle);
                    (0, Helpers_1.rotatePoint)(forcePt, body.rotation);
                    _this.applyPointAsForce(forcePt, body);
                }
            }
            if (force.lifespan > 0) {
                force.age++;
            }
        });
        // remove spent forces
        var i = this.forces.length;
        while (i--) {
            var force = this.forces[i];
            if (force.lifespan > 0 && force.age > force.lifespan) {
                this.forces.splice(i, 1);
            }
        }
    };
    Controller.prototype.applyVelocities = function () {
        this.model.bodies.items.forEach(function (item) {
            item.bounds.anchor.x += Math.max(0 - exports.MAXVEL, Math.min(exports.MAXVEL, item.velocity.x));
            item.bounds.anchor.y += Math.max(0 - exports.MAXVEL, Math.min(exports.MAXVEL, item.velocity.y));
        });
        this.model.projectiles.items.forEach(function (item) {
            item.position.x += item.velocity.x;
            item.position.y += item.velocity.y;
        });
    };
    Controller.prototype.stop = function () {
        console.log('stopping...');
    };
    return Controller;
}());
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map