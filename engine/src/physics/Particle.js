"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseParticle = void 0;
var BaseGeom_1 = require("../geom/BaseGeom");
var BaseParticle = /** @class */ (function () {
    function BaseParticle() {
        this.parentID = -1;
        this.position = new BaseGeom_1.Point();
        this.velocity = new BaseGeom_1.Point();
        this.age = 0;
        this.lifespan = 0;
        this.size = 0;
    }
    BaseParticle.prototype.initWithPositionSizeAndLifespan = function (position, size, lifespan) {
        if (size === void 0) { size = 0; }
        if (lifespan === void 0) { lifespan = 0; }
        this.position = position;
        this.velocity = new BaseGeom_1.Point();
        this.size = size;
        this.age = 0;
        this.lifespan = lifespan;
        return this;
    };
    return BaseParticle;
}());
exports.BaseParticle = BaseParticle;
//# sourceMappingURL=Particle.js.map