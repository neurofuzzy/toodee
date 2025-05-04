import { IGrid, ICell } from './IGrid';
import { IPolygon, ISegment, IPoint } from './IGeom';
export interface ISegmentCell extends ICell<ISegment> {
}
export declare class PolygonGrid<T extends {
    id: number;
    segments: ISegment[];
} & IPolygon> implements IGrid<T> {
    protected cellSize: number;
    protected segmentThickness: number;
    protected itemsCellIndexes: Map<number, Array<number>>;
    protected cells: Map<number, ISegmentCell>;
    constructor(cellSize?: number, segmentThickness?: number);
    init(): this;
    reset(): void;
    get items(): Array<T>;
    protected getCellCoords(item: ISegment): Array<IPoint>;
    protected getCellIndex(x: number, y: number): number;
    protected getCell(x: number, y: number): ISegmentCell | undefined;
    protected getCellByIndex(idx: number): ISegmentCell | undefined;
    addItem(item: T): boolean;
    removeItem(item: T): boolean;
    updateItem(item: T): void;
    getCellFromPoint(pt: IPoint): ISegmentCell | undefined;
    getCellsFromCoords(coords: Array<IPoint>, removeDupes?: boolean): Array<ISegmentCell>;
    getCellsForSegment(seg: ISegment, removeDupes?: boolean): ISegmentCell[] | null;
}
