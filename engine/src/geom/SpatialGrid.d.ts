import { ISpatial } from './ISpatial';
import { IGrid } from './IGrid';
import { IPoint } from './IGeom';
export declare class SpatialGrid<T extends {
    id: number;
    bounds: any;
} & ISpatial> implements IGrid<T> {
    protected cellSize: number;
    protected itemsCellIndexes: Map<number, number>;
    protected cells: Map<number, Array<T>>;
    protected bufferPt: IPoint;
    protected bufferArr: Array<Array<T>>;
    constructor(cellSize?: number);
    init(): this;
    reset(): void;
    get items(): Array<T>;
    protected getCellCoords(item: ISpatial): IPoint;
    protected getCellIndex(x: number, y: number): number;
    protected getCell(x: number, y: number): Array<T>;
    addItem(item: T): boolean;
    removeItem(item: T): boolean;
    updateItem(item: T): void;
    getSurroundingCells(item: T): Array<Array<T>>;
    getCellFromPoint(pt: IPoint): Array<T>;
    getCellsFromCoords(coords: Array<IPoint>, removeDupes?: boolean): Array<Array<T>>;
    getCellsNear(center: IPoint, radius: number): Array<Array<T>>;
    getItemsUnderPoint(pt: IPoint): Array<T>;
    getItemsNear(center: IPoint, radius: number): Array<T>;
}
