var Views;
(function (Views) {
    var TestView = /** @class */ (function () {
        function TestView() {
            this.colors = [
                0xffffff,
                0xff0000,
                0x00ff00,
                0x0000ff
            ];
            this.pixi = new PIXI.Application();
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
            this.fps = document.getElementById("fps");
            this.sectorsContainer = new PIXI.Container();
            this.pixi.stage.addChild(this.sectorsContainer);
            this.bodiesContainer = new PIXI.Container();
            this.pixi.stage.addChild(this.bodiesContainer);
            this.boundariesContainer = new PIXI.Container();
            this.pixi.stage.addChild(this.boundariesContainer);
            this.model.bodies.addListener(this.onModelEvent, this);
            this.model.projectiles.addListener(this.onModelEvent, this);
            this.model.beams.addListener(this.onModelEvent, this);
            return this;
        };
        TestView.prototype.build = function () {
            var _this = this;
            this.pixi.stage.interactive = true;
            this.pixi.stage.hitArea = new PIXI.Rectangle(0, 0, 800, 600);
            // boundaries
            this.model.boundaries.items.forEach(function (boundary, idx) {
                var color = boundary.isSector ? 0x999999 : 0xffffff;
                var gfx = new PIXI.Graphics().lineStyle(2, color, 1.0);
                var bs = boundary.segments;
                if (bs.length > 0) {
                    gfx.moveTo(bs[0].ptA.x, bs[0].ptA.y);
                    for (var i = 1; i < bs.length; i++) {
                        gfx.lineTo(bs[i].ptA.x, bs[i].ptA.y);
                    }
                    gfx.lineTo(bs[0].ptA.x, bs[0].ptA.y);
                }
                // Add to the stage
                if (boundary.isSector) {
                    _this.sectorsContainer.addChild(gfx);
                    _this.sectors[boundary.id] = gfx;
                }
                else {
                    _this.boundariesContainer.addChild(gfx);
                    _this.boundaries[boundary.id] = gfx;
                }
            });
            this.overlay = new PIXI.Graphics();
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
            /*
            
            let r = this.model.ray;
      
            this.ray.clear();
      
            if (this.model.rayHit != undefined) {
              this.ray.lineStyle(2, 0x00ff66, 0.5);
              this.ray.moveTo(r.origin.x, r.origin.y);
              this.ray.lineTo(this.model.rayHit.pt.x, this.model.rayHit.pt.y);
            }
            
            this.testGraphic.clear();
            this.testGraphic.lineStyle(1, 0x00ff00, 0.5);
            
            let cen = r.origin;
            let rad = 150;
            
            let pts = Geom.cellCoordsIntersectingCircle(cen, rad, 100);
      
            for (let i = 0; i < pts.length; i++) {
              let pt = pts[i];
              this.testGraphic.drawRect(pt.x * 100, pt.y * 100, 100, 100);
            }
      
            this.testGraphic.lineStyle(1, 0xff00ff);
            this.testGraphic.drawCircle(cen.x, cen.y, rad);
      
            // proximity force
            this.testGraphic.lineStyle(1, 0x00ff00);
            this.testGraphic.drawCircle(200, 200, 200);
            */
            this.fps.innerText = this.pixi.ticker.FPS.toString();
        };
        TestView.prototype.onModelEvent = function (event) {
            if (!this.built) {
                //return;
            }
            var gfx;
            switch (event.type) {
                case Models.EventType.Add:
                    if (event.source instanceof Simulation.Projectile) {
                        var p = event.source;
                        gfx = new PIXI.Graphics();
                        gfx.beginFill(this.colors[p.id % 4], 1);
                        gfx.drawRect(0 - p.size * 0.5, 0 - p.size * 0.5, p.size, p.size);
                        gfx.x = p.position.x;
                        gfx.y = p.position.y;
                        this.bodiesContainer.addChild(gfx);
                        this.projectiles[p.id] = gfx;
                    }
                    else if (event.source instanceof Simulation.Entity) {
                        var p = event.source;
                        gfx = new PIXI.Graphics()
                            .beginFill(this.colors[p.id % 4], 0.5)
                            .lineStyle(2, this.colors[p.id % 4], 1.0);
                        var b = p.bounds;
                        if (b.shape == Geom.SHAPE_ORTHO) {
                            gfx.drawRect(0 - b.hw, 0 - b.hh, b.hw * 2, b.hh * 2);
                        }
                        else {
                            gfx.drawCircle(0, 0, Math.min(b.hw, b.hh));
                            gfx.endFill();
                            gfx.beginFill(this.colors[p.id % 4], 1)
                                .lineStyle(0);
                            gfx.drawRect(-2, 3 - b.hh, 4, 4);
                            gfx.cacheAsBitmap = true;
                        }
                        gfx.x = b.anchor.x;
                        gfx.y = b.anchor.y;
                        // Add to the stage
                        this.bodiesContainer.addChild(gfx);
                        this.bodies[p.id] = gfx;
                        console.log("body id", p.id);
                    }
                    break;
                case Models.EventType.Remove:
                    gfx = this.projectiles[event.source.id];
                    if (gfx) {
                        this.bodiesContainer.removeChild(gfx);
                    }
                    break;
            }
        };
        return TestView;
    }());
    Views.TestView = TestView;
})(Views || (Views = {}));
//# sourceMappingURL=TestView.js.map