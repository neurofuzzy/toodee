namespace Views {

  export function makeDraggable (item:Geom.ISpatial, dobj:PIXI.DisplayObject):void {

    dobj.interactive = true;
    dobj.buttonMode = true;

    var onDragStart = function (event) {
      // store a reference to the data
      // the reason for this is because of multitouch
      // we want to track the movement of this particular touch
      this.data = event.data;
      this.alpha = 0.5;
      this.dragging = true;
    }
  
    var onDragEnd = function (event) {
      this.alpha = 1;
      this.dragging = false;
      // set the interaction data to null
      this.data = null;
    }
  
    var onDragMove = function (event) {
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

}