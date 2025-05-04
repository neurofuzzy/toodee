"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Engine = void 0;
var Model_1 = require("./simulation/Model");
var Controller_1 = require("./simulation/Controller");
var Engine = /** @class */ (function () {
    function Engine() {
    }
    Engine.prototype.init = function () {
        this.model = new Model_1.Model().init();
        this.simulation = new Controller_1.Controller().initWithModel(this.model);
        return this;
    };
    Engine.prototype.start = function () {
        this.simulation.start();
    };
    Engine.prototype.update = function () {
        this.simulation.update();
    };
    Engine.prototype.stop = function () {
        this.simulation.stop();
    };
    Object.defineProperty(Engine.prototype, "api", {
        get: function () {
            return this.simulation.api;
        },
        enumerable: false,
        configurable: true
    });
    return Engine;
}());
exports.Engine = Engine;
//# sourceMappingURL=Engine.js.map