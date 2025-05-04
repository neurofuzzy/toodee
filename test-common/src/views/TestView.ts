import * as PIXI from 'pixi.js';
import { IView, IEvent, EventType } from '../../../engine/src/models';
import { Model, Entity, Boundary, Projectile, Beam } from '../../../engine/src/simulation';
import { SHAPE_ORTHO } from '../../../engine/src/geom/Helpers';
import { Geom } from '../../../engine/src/geom';

export class TestView implements IView<Model> {
  protected model: Model;
  protected sectors: Array<PIXI.Graphics>;
  protected sectorsContainer: PIXI.Container;
  protected boundaries: Array<PIXI.Graphics>;
  protected boundariesContainer: PIXI.Container;
  protected bodies: Array<PIXI.Graphics>;
  protected bodiesContainer: PIXI.Container;
  protected projectiles: Array<PIXI.Graphics>;
  protected ray: PIXI.Graphics;
  protected overlay: PIXI.Graphics;

  public pixi: PIXI.Application;
  private fps: HTMLElement;
  protected built: boolean;

  public bodiesGraphics(): Array<any> {
    return this.bodies;
  }

  private colors = [0xffffff, 0xff0000, 0x00ff00, 0x0000ff];

  constructor() {
    this.pixi = new PIXI.Application();
    document.body.appendChild(this.pixi.view);
  }

  public initWithModel(model: Model): any {
    this.model = model;
    this.sectors = [];
    this.bodies = [];
    this.boundaries = [];
    this.projectiles = [];
    this.fps = document.getElementById('fps');

    this.sectorsContainer = new PIXI.Container();
    this.pixi.stage.addChild(this.sectorsContainer);
    this.bodiesContainer = new PIXI.Container();
    this.pixi.stage.addChild(this.bodiesContainer);
    this.boundariesContainer = new PIXI.Container();
    this.pixi.stage.addChild(this.boundariesContainer);

    this.model.bodies.addListener(this.onModelEvent.bind(this));
    this.model.projectiles.addListener(this.onModelEvent.bind(this));
    this.model.beams.addListener(this.onModelEvent.bind(this));

    return this;
  }

  public build() {
    this.pixi.stage.interactive = true;
    this.pixi.stage.hitArea = new PIXI.Rectangle(0, 0, 800, 600);

    this.model.boundaries.items.forEach((boundary, idx) => {
      let color = boundary.isSector ? 0x999999 : 0xffffff;
      let gfx = new PIXI.Graphics().lineStyle(2, color, 1.0);
      let bs = boundary.segments;
      if (bs.length > 0) {
        gfx.moveTo(bs[0].ptA.x, bs[0].ptA.y);
        for (let i = 1; i < bs.length; i++) {
          gfx.lineTo(bs[i].ptA.x, bs[i].ptA.y);
        }
        gfx.lineTo(bs[0].ptA.x, bs[0].ptA.y);
      }
      if (boundary.isSector) {
        this.sectorsContainer.addChild(gfx);
        this.sectors[boundary.id] = gfx;
      } else {
        this.boundariesContainer.addChild(gfx);
        this.boundaries[boundary.id] = gfx;
      }
    });
    this.overlay = new PIXI.Graphics();
    this.pixi.stage.addChild(this.overlay);
    this.built = true;
  }

  public update() {
    this.overlay.clear();
    this.model.bodies.items.forEach(item => {
      let gfx = this.bodies[item.id];
      if (gfx) {
        gfx.x = item.bounds.anchor.x;
        gfx.y = item.bounds.anchor.y;
        gfx.rotation = item.rotation;
      }
    });
    this.model.projectiles.items.forEach(item => {
      let gfx = this.projectiles[item.id];
      if (gfx) {
        gfx.x = item.position.x;
        gfx.y = item.position.y;
      }
    });
    this.model.beams.items.forEach(beam => {
      this.overlay.moveTo(beam.ray.ptA.x, beam.ray.ptA.y);
      this.overlay.lineStyle(1, 0xff00ff);
      this.overlay.lineTo(beam.ray.ptB.x, beam.ray.ptB.y);
    });
    if (this.fps) this.fps.innerText = this.pixi.ticker.FPS.toString();
  }

  public onModelEvent(event: IEvent<Entity | Boundary | Projectile | Beam>) {
    if (!this.built) return;
    let gfx: PIXI.Graphics;
    switch (event.type) {
      case EventType.Add:
        if (event.source instanceof Projectile) {
          let p = event.source as Projectile;
          gfx = new PIXI.Graphics();
          gfx.beginFill(this.colors[p.id % 4], 1);
          gfx.drawRect(0 - p.size * 0.5, 0 - p.size * 0.5, p.size, p.size);
          gfx.x = p.position.x;
          gfx.y = p.position.y;
          this.bodiesContainer.addChild(gfx);
          this.projectiles[p.id] = gfx;
        } else if (event.source instanceof Entity) {
          let p = event.source as Entity;
          gfx = new PIXI.Graphics().beginFill(this.colors[p.id % 4], 0.5).lineStyle(2, this.colors[p.id % 4], 1.0);
          let b = p.bounds;
          if (b.shape == SHAPE_ORTHO) {
            gfx.drawRect(0 - b.hw, 0 - b.hh, b.hw * 2, b.hh * 2);
          } else {
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
      case EventType.Remove:
        gfx = this.projectiles[event.source.id];
        if (gfx) {
          this.bodiesContainer.removeChild(gfx);
        }
        break;
    }
  }
}