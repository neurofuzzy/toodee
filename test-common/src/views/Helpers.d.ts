declare namespace Views {
    function makeItemDraggable(item: Geom.ISpatial, dobj: PIXI.DisplayObject): void;
    function makeSegmentDraggable(ray: Geom.ISegment, dobj: PIXI.DisplayObject, stage: PIXI.Container): void;
}
