import { ISpatial } from '../../../engine/src/geom/ISpatial';
import { DisplayObject, Container } from '@pixi/display';
import { ISegment } from '../../../engine/src/geom/IGeom';
export declare function makeItemDraggable(item: ISpatial, dobj: DisplayObject): void;
export declare function makeSegmentDraggable(ray: ISegment, dobj: DisplayObject, stage: Container): void;
