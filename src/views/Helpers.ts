namespace Views {

  export function makeItemDraggable (item:Util.Geom.ISpatial, dobj:PIXI.DisplayObject):void {

    dobj.interactive = true;
    dobj.buttonMode = true;

    var onDragStart = function (event:PIXI.interaction.InteractionEvent) {
      // store a reference to the data
      // the reason for this is because of multitouch
      // we want to track the movement of this particular touch
      this.data = event.data;
      this.alpha = 0.5;
      this.dragging = true;
    }
  
    var onDragEnd = function (event:PIXI.interaction.InteractionEvent) {
      this.alpha = 1;
      this.dragging = false;
      // set the interaction data to null
      this.data = null;
    }
  
    var onDragMove = function (event:PIXI.interaction.InteractionEvent) {
      if (this.dragging) {
        var newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
        item.bounds.anchor.x = this.x;
        item.bounds.anchor.y = this.y;
      }
    }

    dobj
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);

  }

  export function makeSegmentDraggable (ray:Util.Geom.ISegment, dobj:PIXI.DisplayObject, stage:PIXI.Container):void {

    dobj.interactive = true;
    dobj.buttonMode = true;

    var dragOrigin = false;

    var onDragStart = function (event:PIXI.interaction.InteractionEvent) {
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
    }
  
    var onDragEnd = function (event:PIXI.interaction.InteractionEvent) {
      this.alpha = 1;
      this.dragging = false;
      // set the interaction data to null
      this.data = null;
      dragOrigin = !dragOrigin;
    }
  
    var onDragMove = function (event:PIXI.interaction.InteractionEvent) {
      if (this.dragging) {
        if (dragOrigin) {
          ray.ptA.x = event.data.global.x;
          ray.ptA.y = event.data.global.y;
        } else {
          ray.ptB.x = event.data.global.x;
          ray.ptB.y = event.data.global.y;
        }
      }
    }

    stage
    .on('pointerdown', onDragStart)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);

  }

}