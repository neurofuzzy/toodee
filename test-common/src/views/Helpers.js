var Views;
(function (Views) {
    function makeItemDraggable(item, dobj) {
        dobj.interactive = true;
        dobj.buttonMode = true;
        var onDragStart = function (event) {
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
        };
        var onDragEnd = function (event) {
            this.alpha = 1;
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
        };
        var onDragMove = function (event) {
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
    Views.makeItemDraggable = makeItemDraggable;
    function makeSegmentDraggable(ray, dobj, stage) {
        dobj.interactive = true;
        dobj.buttonMode = true;
        var dragOrigin = false;
        var onDragStart = function (event) {
            // store a reference to the data
            // the reason for this is because of multitouch
            // we want to track the movement of this particular touch
            this.data = event.data;
            this.alpha = 0.5;
            this.dragging = true;
            if (dragOrigin) {
                ray.ptA.x = event.data.global.x;
                ray.ptA.y = event.data.global.y;
            }
            else {
                ray.ptB.x = event.data.global.x;
                ray.ptB.y = event.data.global.y;
            }
        };
        var onDragEnd = function (event) {
            this.alpha = 1;
            this.dragging = false;
            // set the interaction data to null
            this.data = null;
            dragOrigin = !dragOrigin;
        };
        var onDragMove = function (event) {
            if (this.dragging) {
                if (dragOrigin) {
                    ray.ptA.x = event.data.global.x;
                    ray.ptA.y = event.data.global.y;
                }
                else {
                    ray.ptB.x = event.data.global.x;
                    ray.ptB.y = event.data.global.y;
                }
            }
        };
        stage
            .on('pointerdown', onDragStart)
            .on('pointerup', onDragEnd)
            .on('pointerupoutside', onDragEnd)
            .on('pointermove', onDragMove);
    }
    Views.makeSegmentDraggable = makeSegmentDraggable;
})(Views || (Views = {}));
//# sourceMappingURL=Helpers.js.map