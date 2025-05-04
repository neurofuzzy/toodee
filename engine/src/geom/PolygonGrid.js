"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonGrid = void 0;
var Helpers_1 = require("./Helpers");
var Pairing_1 = require("../util/Pairing");
var PolygonGrid = /** @class */ (function () {
    function PolygonGrid(cellSize, segmentThickness) {
        if (cellSize === void 0) { cellSize = 100; }
        if (segmentThickness === void 0) { segmentThickness = 0; }
        this.cellSize = cellSize;
        this.segmentThickness = segmentThickness;
    }
    PolygonGrid.prototype.init = function () {
        this.reset();
        return this;
    };
    PolygonGrid.prototype.reset = function () {
        this.itemsCellIndexes = new Map();
        this.cells = new Map();
    };
    Object.defineProperty(PolygonGrid.prototype, "items", {
        get: function () {
            var outArr = [];
            // TODO: return items if necessary
            return outArr;
        },
        enumerable: false,
        configurable: true
    });
    PolygonGrid.prototype.getCellCoords = function (item) {
        return (0, Helpers_1.cellCoordsAlongLineWithThickness)(item.ptA.x, item.ptA.y, item.ptB.x, item.ptB.y, this.cellSize, this.segmentThickness);
    };
    PolygonGrid.prototype.getCellIndex = function (x, y) {
        return (0, Pairing_1.cantorPair)(x + 1000, y + 1000);
    };
    PolygonGrid.prototype.getCell = function (x, y) {
        return this.cells.get(this.getCellIndex(x, y));
    };
    PolygonGrid.prototype.getCellByIndex = function (idx) {
        return this.cells.get(idx);
    };
    PolygonGrid.prototype.addItem = function (item) {
        var _this = this;
        if (!this.itemsCellIndexes.has(item.id)) {
            this.itemsCellIndexes.set(item.id, []);
            item.segments.forEach(function (seg) {
                var coords = _this.getCellCoords(seg);
                coords.forEach(function (coord) {
                    var cidx = _this.getCellIndex(coord.x, coord.y);
                    if (!_this.cells.has(cidx)) {
                        _this.cells.set(cidx, []);
                    }
                    _this.itemsCellIndexes.get(item.id).push(cidx);
                    _this.cells.get(cidx).push(seg);
                });
            });
            return true;
        }
        return false;
    };
    PolygonGrid.prototype.removeItem = function (item) {
        var _this = this;
        if (this.itemsCellIndexes.has(item.id)) {
            item.segments.forEach(function (seg) {
                var cidxs = _this.itemsCellIndexes.get(item.id);
                cidxs.forEach(function (cidx) {
                    var cell = _this.cells.get(cidx);
                    var idx = cell.indexOf(seg);
                    if (idx !== -1)
                        cell.splice(idx, 1);
                });
            });
            this.itemsCellIndexes.delete(item.id);
            return true;
        }
        return false;
    };
    PolygonGrid.prototype.updateItem = function (item) {
        this.removeItem(item);
        this.addItem(item);
    };
    PolygonGrid.prototype.getCellFromPoint = function (pt) {
        var idx = this.getCellIndex(Math.floor(pt.x / this.cellSize), Math.floor(pt.y / this.cellSize));
        return this.cells.get(idx);
    };
    PolygonGrid.prototype.getCellsFromCoords = function (coords, removeDupes) {
        var _this = this;
        if (removeDupes === void 0) { removeDupes = false; }
        var matchingCells = [];
        var seen = removeDupes ? new Set() : null;
        coords.forEach(function (coord) {
            var idx = _this.getCellIndex(coord.x, coord.y);
            var cell = _this.cells.get(idx);
            if (cell != null) {
                if (!removeDupes || !seen.has(cell)) {
                    matchingCells.push(cell);
                    if (removeDupes)
                        seen.add(cell);
                }
            }
        });
        return matchingCells;
    };
    PolygonGrid.prototype.getCellsForSegment = function (seg, removeDupes) {
        var _this = this;
        if (removeDupes === void 0) { removeDupes = false; }
        var seen = removeDupes ? new Set() : null;
        var cells = [];
        var coords = this.getCellCoords(seg);
        coords.forEach(function (coord) {
            var idx = _this.getCellIndex(coord.x, coord.y);
            var cell = _this.getCellByIndex(idx);
            if (cell != null) {
                if (!removeDupes || !seen.has(cell)) {
                    cells.push(cell);
                    if (removeDupes)
                        seen.add(cell);
                }
            }
        });
        return cells.length ? cells : null;
    };
    return PolygonGrid;
}());
exports.PolygonGrid = PolygonGrid;
//# sourceMappingURL=PolygonGrid.js.map