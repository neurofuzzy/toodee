"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpatialGrid = void 0;
var BaseGeom_1 = require("./BaseGeom");
var Pairing_1 = require("../util/Pairing");
var Helpers_1 = require("./Helpers");
var SpatialGrid = /** @class */ (function () {
    function SpatialGrid(cellSize) {
        if (cellSize === void 0) { cellSize = 100; }
        this.cellSize = cellSize;
    }
    SpatialGrid.prototype.init = function () {
        this.reset();
        return this;
    };
    SpatialGrid.prototype.reset = function () {
        this.itemsCellIndexes = new Map();
        this.cells = new Map();
        this.bufferPt = new BaseGeom_1.Point();
        this.bufferArr = [];
    };
    Object.defineProperty(SpatialGrid.prototype, "items", {
        get: function () {
            var outArr = [];
            // TODO: return items if necessary
            return outArr;
        },
        enumerable: false,
        configurable: true
    });
    SpatialGrid.prototype.getCellCoords = function (item) {
        var pt = this.bufferPt;
        pt.x = Math.floor(item.bounds.anchor.x / this.cellSize);
        pt.y = Math.floor(item.bounds.anchor.y / this.cellSize);
        return pt;
    };
    SpatialGrid.prototype.getCellIndex = function (x, y) {
        return (0, Pairing_1.cantorPair)(x + 1000, y + 1000);
    };
    SpatialGrid.prototype.getCell = function (x, y) {
        return this.cells.get(this.getCellIndex(x, y)) || [];
    };
    SpatialGrid.prototype.addItem = function (item) {
        if (!this.itemsCellIndexes.has(item.id)) {
            var coords = this.getCellCoords(item);
            var cidx = this.getCellIndex(coords.x, coords.y);
            if (!this.cells.has(cidx)) {
                this.cells.set(cidx, []);
            }
            this.itemsCellIndexes.set(item.id, cidx);
            this.cells.get(cidx).push(item);
            return true;
        }
        return false;
    };
    SpatialGrid.prototype.removeItem = function (item) {
        if (this.itemsCellIndexes.has(item.id)) {
            var cidx = this.itemsCellIndexes.get(item.id);
            var cell = this.cells.get(cidx);
            var idx = cell.indexOf(item);
            if (idx !== -1)
                cell.splice(idx, 1);
            this.itemsCellIndexes.delete(item.id);
            return true;
        }
        return false;
    };
    SpatialGrid.prototype.updateItem = function (item) {
        var coords = this.getCellCoords(item);
        var cidx = this.getCellIndex(coords.x, coords.y);
        if (cidx != this.itemsCellIndexes.get(item.id)) {
            this.removeItem(item);
            this.addItem(item);
        }
    };
    SpatialGrid.prototype.getSurroundingCells = function (item) {
        var pt = this.getCellCoords(item);
        var arr = this.bufferArr;
        arr[0] = this.getCell(pt.x, pt.y);
        arr[1] = this.getCell(pt.x, pt.y - 1);
        arr[2] = this.getCell(pt.x, pt.y + 1);
        arr[3] = this.getCell(pt.x - 1, pt.y);
        arr[4] = this.getCell(pt.x + 1, pt.y);
        arr[5] = this.getCell(pt.x - 1, pt.y - 1);
        arr[6] = this.getCell(pt.x + 1, pt.y - 1);
        arr[7] = this.getCell(pt.x - 1, pt.y + 1);
        arr[8] = this.getCell(pt.x + 1, pt.y + 1);
        return arr;
    };
    SpatialGrid.prototype.getCellFromPoint = function (pt) {
        var idx = this.getCellIndex(Math.floor(pt.x / this.cellSize), Math.floor(pt.y / this.cellSize));
        return this.cells.get(idx) || [];
    };
    SpatialGrid.prototype.getCellItems = function (x, y) {
        return this.cells.get(this.getCellIndex(x, y)) || [];
    };
    SpatialGrid.prototype.getCellItemsByIndex = function (idx) {
        return this.cells.get(idx) || [];
    };
    SpatialGrid.prototype.getCellsFromCoords = function (coords, removeDupes) {
        if (removeDupes === void 0) { removeDupes = false; }
        var cells = [];
        var seen = removeDupes ? new Set() : null;
        for (var _i = 0, coords_1 = coords; _i < coords_1.length; _i++) {
            var pt = coords_1[_i];
            var cell = this.getCellItems(Math.floor(pt.x), Math.floor(pt.y));
            for (var _a = 0, cell_1 = cell; _a < cell_1.length; _a++) {
                var item = cell_1[_a];
                if (!removeDupes || (seen && !seen.has(item))) {
                    cells.push(item);
                    if (removeDupes && seen)
                        seen.add(item);
                }
            }
        }
        return cells;
    };
    SpatialGrid.prototype.getCellsNear = function (center, radius) {
        // TODO: Implement cellCoordsIntersectingCircle and import if needed
        return [];
    };
    SpatialGrid.prototype.getItemsUnderPoint = function (pt) {
        var items = [];
        var cells = this.getCellsNear(pt, this.cellSize * 0.25);
        if (!cells)
            return items;
        cells.forEach(function (cell) {
            if (!cell)
                return;
            cell.forEach(function (item) {
                if (item.bounds.shape == Helpers_1.SHAPE_ORTHO) {
                    if ((0, Helpers_1.pointWithinBounds)(pt.x, pt.y, item.bounds)) {
                        items.push(item);
                    }
                }
                else {
                    if ((0, Helpers_1.distanceBetween)(pt.x, pt.y, item.bounds.anchor.x, item.bounds.anchor.y) < item.bounds.hw) {
                        items.push(item);
                    }
                }
            });
        });
        return items;
    };
    SpatialGrid.prototype.getItemsNear = function (center, radius) {
        var items = [];
        var cells = this.getCellsNear(center, radius);
        if (!cells)
            return items;
        cells.forEach(function (cell) {
            if (!cell)
                return;
            cell.forEach(function (item) {
                if ((0, Helpers_1.distanceBetween)(center.x, center.y, item.bounds.anchor.x, item.bounds.anchor.y) <= radius) {
                    items.push(item);
                }
            });
        });
        return items;
    };
    return SpatialGrid;
}());
exports.SpatialGrid = SpatialGrid;
//# sourceMappingURL=SpatialGrid.js.map