import { ISpatial } from '../../../engine/src/geom/ISpatial';
import { DisplayObject, Container } from 'pixi.js';
import { ISegment } from '../../../engine/src/geom/IGeom';

export function makeItemDraggable(item: ISpatial, dobj: DisplayObject): void {
  (dobj as any).interactive = true;
  (dobj as any).buttonMode = true;

  const onDragStart = function (this: any, event: any) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
  };

  const onDragEnd = function (this: any, event: any) {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
  };

  const onDragMove = function (this: any, event: any) {
    if (this.dragging) {
      var newPosition = this.data.getLocalPosition(this.parent);
      this.x = newPosition.x;
      this.y = newPosition.y;
      item.bounds.anchor.x = this.x;
      item.bounds.anchor.y = this.y;
    }
  };

  dobj
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);
}

export function makeSegmentDraggable(ray: ISegment, dobj: DisplayObject, stage: Container): void {
  (dobj as any).interactive = true;
  (dobj as any).buttonMode = true;

  let dragOrigin = false;

  const onDragStart = function (this: any, event: any) {
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    this.data = event.data;
    this.alpha = 0.5;
    this.dragging = true;
    if (dragOrigin) {
      ray.ptA.x = event.data.global.x;
      ray.ptA.y = event.data.global.y;
    } else {
      ray.ptB.x = event.data.global.x;
      ray.ptB.y = event.data.global.y;
    }
  };

  const onDragEnd = function (this: any, event: any) {
    this.alpha = 1;
    this.dragging = false;
    // set the interaction data to null
    this.data = null;
    dragOrigin = !dragOrigin;
  };

  const onDragMove = function (this: any, event: any) {
    if (this.dragging) {
      if (dragOrigin) {
        ray.ptA.x = event.data.global.x;
        ray.ptA.y = event.data.global.y;
      } else {
        ray.ptB.x = event.data.global.x;
        ray.ptB.y = event.data.global.y;
      }
    }
  };

  dobj
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);
}