"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestView = void 0;
var pixi_js_1 = require("pixi.js");
var models_1 = require("../../../engine/src/models");
var simulation_1 = require("../../../engine/src/simulation");
var Helpers_1 = require("../../../engine/src/geom/Helpers");
var TestView = /** @class */ (function () {
    function TestView() {
        this.colors = [0xffffff, 0xff0000, 0x00ff00, 0x0000ff];
        this.pixi = new pixi_js_1.Application();
        document.body.appendChild(this.pixi.view);
    }
    TestView.prototype.bodiesGraphics = function () {
        return this.bodies;
    };
    TestView.prototype.initWithModel = function (model) {
        this.model = model;
        this.sectors = [];
        this.bodies = [];
        this.boundaries = [];
        this.projectiles = [];
        this.fps = document.getElementById('fps');
        this.sectorsContainer = new pixi_js_1.Container();
        this.pixi.stage.addChild(this.sectorsContainer);
        this.bodiesContainer = new pixi_js_1.Container();
        this.pixi.stage.addChild(this.bodiesContainer);
        this.boundariesContainer = new pixi_js_1.Container();
        this.pixi.stage.addChild(this.boundariesContainer);
        this.model.bodies.addListener(this.onModelEvent, this);
        this.model.projectiles.addListener(this.onModelEvent, this);
        this.model.beams.addListener(this.onModelEvent, this);
        return this;
    };
    TestView.prototype.build = function () {
        var _this = this;
        this.pixi.stage.interactive = true;
        this.pixi.stage.hitArea = new pixi_js_1.Rectangle(0, 0, 800, 600);
        this.model.boundaries.items.forEach(function (boundary, idx) {
            var color = boundary.isSector ? 0x999999 : 0xffffff;
            var gfx = new pixi_js_1.Graphics().lineStyle(2, color, 1.0);
            var bs = boundary.segments;
            if (bs.length > 0) {
                gfx.moveTo(bs[0].ptA.x, bs[0].ptA.y);
                for (var i = 1; i < bs.length; i++) {
                    gfx.lineTo(bs[i].ptA.x, bs[i].ptA.y);
                }
                gfx.lineTo(bs[0].ptA.x, bs[0].ptA.y);
            }
            if (boundary.isSector) {
                _this.sectorsContainer.addChild(gfx);
                _this.sectors[boundary.id] = gfx;
            }
            else {
                _this.boundariesContainer.addChild(gfx);
                _this.boundaries[boundary.id] = gfx;
            }
        });
        this.overlay = new pixi_js_1.Graphics();
        this.pixi.stage.addChild(this.overlay);
        this.built = true;
    };
    TestView.prototype.update = function () {
        var _this = this;
        this.overlay.clear();
        this.model.bodies.items.forEach(function (item) {
            var gfx = _this.bodies[item.id];
            if (gfx) {
                gfx.x = item.bounds.anchor.x;
                gfx.y = item.bounds.anchor.y;
                gfx.rotation = item.rotation;
            }
        });
        this.model.projectiles.items.forEach(function (item) {
            var gfx = _this.projectiles[item.id];
            if (gfx) {
                gfx.x = item.position.x;
                gfx.y = item.position.y;
            }
        });
        this.model.beams.items.forEach(function (beam) {
            _this.overlay.moveTo(beam.ray.ptA.x, beam.ray.ptA.y);
            _this.overlay.lineStyle(1, 0xff00ff);
            _this.overlay.lineTo(beam.ray.ptB.x, beam.ray.ptB.y);
        });
        if (this.fps)
            this.fps.innerText = this.pixi.ticker.FPS.toString();
    };
    TestView.prototype.onModelEvent = function (event) {
        if (!this.built)
            return;
        var gfx;
        switch (event.type) {
            case models_1.EventType.Add:
                if (event.source instanceof simulation_1.Projectile) {
                    var p = event.source;
                    gfx = new pixi_js_1.Graphics();
                    gfx.beginFill(this.colors[p.id % 4], 1);
                    gfx.drawRect(0 - p.size * 0.5, 0 - p.size * 0.5, p.size, p.size);
                    gfx.x = p.position.x;
                    gfx.y = p.position.y;
                    this.bodiesContainer.addChild(gfx);
                    this.projectiles[p.id] = gfx;
                }
                else if (event.source instanceof simulation_1.Entity) {
                    var p = event.source;
                    gfx = new pixi_js_1.Graphics().beginFill(this.colors[p.id % 4], 0.5).lineStyle(2, this.colors[p.id % 4], 1.0);
                    var b = p.bounds;
                    if (b.shape == Helpers_1.SHAPE_ORTHO) {
                        gfx.drawRect(0 - b.hw, 0 - b.hh, b.hw * 2, b.hh * 2);
                    }
                    else {
                        gfx.drawCircle(0, 0, Math.min(b.hw, b.hh));
                        gfx.endFill();
                        gfx.beginFill(this.colors[p.id % 4], 1).lineStyle(0);
                        gfx.drawRect(-2, 3 - b.hh, 4, 4);
                        gfx.cacheAsBitmap = true;
                    }
                    gfx.x = b.anchor.x;
                    gfx.y = b.anchor.y;
                    this.bodiesContainer.addChild(gfx);
                    this.bodies[p.id] = gfx;
                }
                break;
            case models_1.EventType.Remove:
                gfx = this.projectiles[event.source.id];
                if (gfx) {
                    this.bodiesContainer.removeChild(gfx);
                }
                break;
        }
    };
    return TestView;
}());
exports.TestView = TestView;
//# sourceMappingURL=TestView.js.map