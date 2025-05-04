import { IPoint } from './IGeom';
export interface ICell<T> extends Array<T> {
}
export interface IGrid<T> {
    getCellFromPoint(pt: IPoint): any;
    getCellsFromCoords(coords: Array<IPoint>, removeDupes: boolean): any[];
    addItem(item: T): boolean;
    removeItem(item: T): boolean;
    updateItem(item: T): void;
}
