"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
// Migrated from namespace Simulation to ES module
var BaseCollection_1 = require("../models/BaseCollection");
var ChildCollection_1 = require("../models/ChildCollection");
var BaseGeom_1 = require("../geom/BaseGeom");
var Model = /** @class */ (function () {
    function Model() {
    }
    Model.prototype.init = function () {
        this.boundaries = new BaseCollection_1.BaseCollection().init();
        this.projectiles = new BaseCollection_1.BaseCollection().init();
        this.bodies = new BaseCollection_1.BaseCollection().init();
        this.beams = new ChildCollection_1.ChildCollection().init();
        this.ray = new BaseGeom_1.Ray();
        return this;
    };
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=Model.js.map