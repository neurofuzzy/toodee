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
exports.SpatialPolygonMap = void 0;
var Events_1 = require("../models/Events");
var SpatialPolygonMap = /** @class */ (function (_super) {
    __extends(SpatialPolygonMap, _super);
    function SpatialPolygonMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SpatialPolygonMap.prototype.init = function () {
        this.reset();
        return this;
    };
    SpatialPolygonMap.prototype.reset = function () {
        _super.prototype.reset.call(this);
        this.items = new Map();
        this.itemsPolygonIDs = new Map();
        this.containers = new Map();
        this.polygonsByID = new Map();
        this.polygonsSortedByArea = [];
    };
    SpatialPolygonMap.prototype.getOutermostPolygon = function () {
        return this.polygonsSortedByArea[this.polygonsSortedByArea.length - 1];
    };
    SpatialPolygonMap.prototype.getPolygonFromPoint = function (pt, includeInverted) {
        if (includeInverted === void 0) { includeInverted = false; }
        for (var i = 0; i < this.polygonsSortedByArea.length; i++) {
            var poly = this.polygonsSortedByArea[i];
            if (poly.inverted && !includeInverted) {
                continue;
            }
            // TODO: Implement pointInPolygon
            // if (pointInPolygon(pt, poly)) {
            //   return poly as K;
            // }
        }
        return undefined;
    };
    SpatialPolygonMap.prototype.getPolygonId = function (pt) {
        var poly = this.getPolygonFromPoint(pt);
        if (poly) {
            return poly.id;
        }
        return -1;
    };
    SpatialPolygonMap.prototype.getContainerFromPoint = function (pt) {
        var polygonId = this.getPolygonId(pt);
        if (polygonId >= 0) {
            return this.containers.get(polygonId) || [];
        }
        return undefined;
    };
    SpatialPolygonMap.prototype.addPolygon = function (poly) {
        this.polygonsByID.set(poly.id, poly);
        this.containers.set(poly.id, []);
        this.polygonsSortedByArea.push(poly);
        this.polygonsSortedByArea.sort(function (a, b) { var _a, _b; return ((_a = a.area) !== null && _a !== void 0 ? _a : 0) - ((_b = b.area) !== null && _b !== void 0 ? _b : 0); });
    };
    SpatialPolygonMap.prototype.addItem = function (item) {
        if (!this.itemsPolygonIDs.has(item.id)) {
            var polygonID = this.getPolygonId(item.bounds.anchor);
            this.itemsPolygonIDs.set(item.id, polygonID);
            if (polygonID >= 0) {
                if (!this.containers.has(polygonID)) {
                    this.containers.set(polygonID, []);
                }
                this.containers.get(polygonID).push(item);
            }
            this.items.set(item.id, item);
            return true;
        }
        return false;
    };
    SpatialPolygonMap.prototype.removeItem = function (item) {
        if (this.itemsPolygonIDs.has(item.id)) {
            var polygonID = this.itemsPolygonIDs.get(item.id);
            if (polygonID > 0) {
                var container = this.containers.get(polygonID);
                if (container) {
                    var idx = container.indexOf(item);
                    if (idx !== -1)
                        container.splice(idx, 1);
                }
            }
            this.itemsPolygonIDs.delete(item.id);
            this.items.delete(item.id);
            return true;
        }
        return false;
    };
    SpatialPolygonMap.prototype.updateItem = function (item) {
        var polygonID = this.getPolygonId(item.bounds.anchor);
        var prevPolygonID = this.itemsPolygonIDs.get(item.id);
        if (polygonID != prevPolygonID) {
            this.removeItem(item);
            this.addItem(item);
            if (prevPolygonID !== undefined && prevPolygonID >= 0) {
                var prevPoly = this.polygonsByID.get(prevPolygonID);
                if (prevPoly)
                    this.dispatch(Events_1.EventType.Remove, prevPoly, item);
            }
            if (polygonID >= 0) {
                var poly = this.polygonsByID.get(polygonID);
                if (poly)
                    this.dispatch(Events_1.EventType.Add, poly, item);
            }
            return true;
        }
        return false;
    };
    SpatialPolygonMap.prototype.getPolygonByItemID = function (itemID) {
        var polygonID = this.itemsPolygonIDs.get(itemID);
        if (polygonID !== undefined && polygonID >= 0) {
            return this.polygonsByID.get(polygonID);
        }
        return undefined;
    };
    SpatialPolygonMap.prototype.getItemsWithinPolygonID = function (polygonID) {
        return this.containers.get(polygonID) || [];
    };
    Object.defineProperty(SpatialPolygonMap.prototype, "itemsArray", {
        get: function () {
            return Array.from(this.items.values());
        },
        enumerable: false,
        configurable: true
    });
    return SpatialPolygonMap;
}(Events_1.EventDispatcher));
exports.SpatialPolygonMap = SpatialPolygonMap;
//# sourceMappingURL=SpatialPolygonMap.js.map