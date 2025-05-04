import { IPolygon, IPoint } from './IGeom';
import { EventDispatcher } from '../models/Events';
import { IContainer } from '../util/IContainer';
export interface IPolygonMap<T> {
    addPolygon(poly: IPolygon & {
        id: number;
    }): void;
    getPolygonFromPoint(pt: IPoint): IPolygon & {
        id: number;
    };
    getContainerFromPoint(pt: IPoint): IContainer<T>;
}
export declare class SpatialPolygonMap<T extends IPolygon & {
    id: number;
}, K extends {
    id: number;
    bounds: any;
}> extends EventDispatcher<T> implements IPolygonMap<K> {
    items: Map<number, K>;
    protected itemsPolygonIDs: Map<number, number>;
    protected containers: Map<number, IContainer<K>>;
    protected polygonsByID: Map<number, T>;
    protected polygonsSortedByArea: Array<T>;
    init(): this;
    reset(): void;
    getOutermostPolygon(): T;
    getPolygonFromPoint(pt: IPoint, includeInverted?: boolean): T;
    protected getPolygonId(pt: IPoint): number;
    getContainerFromPoint(pt: IPoint): IContainer<K>;
    addPolygon(poly: T): void;
    addItem(item: K): boolean;
    removeItem(item: K): boolean;
    updateItem(item: K): boolean;
    getPolygonByItemID(itemID: number): T;
    getItemsWithinPolygonID(polygonID: number): IContainer<K>;
    get itemsArray(): K[];
}
