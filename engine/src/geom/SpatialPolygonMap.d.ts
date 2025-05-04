import { IPoint, IPolygonBase } from './IGeom';
import { EventDispatcher } from '../models/Events';
export interface IContainer<T> extends Array<T> {
}
export interface IPolygonMap<K extends IPolygonBase> {
    addPolygon(poly: K): void;
    getPolygonFromPoint(pt: IPoint): K | undefined;
    getContainerFromPoint(pt: IPoint): IContainer<K> | undefined;
}
export declare class SpatialPolygonMap<T extends IPolygonBase, K extends IPolygonBase = T> extends EventDispatcher<T> implements IPolygonMap<K> {
    items: Map<number, K>;
    protected itemsPolygonIDs: Map<number, number>;
    protected containers: Map<number, IContainer<K>>;
    protected polygonsByID: Map<number, T>;
    protected polygonsSortedByArea: Array<T>;
    init(): this;
    reset(): void;
    getOutermostPolygon(): T;
    getPolygonFromPoint(pt: IPoint, includeInverted?: boolean): K | undefined;
    protected getPolygonId(pt: IPoint): number;
    getContainerFromPoint(pt: IPoint): IContainer<K> | undefined;
    addPolygon(poly: K): void;
    addItem(item: K): boolean;
    removeItem(item: K): boolean;
    updateItem(item: K): boolean;
    getPolygonByItemID(itemID: number): T | undefined;
    getItemsWithinPolygonID(polygonID: number): IContainer<K> | undefined;
    get itemsArray(): K[];
}
