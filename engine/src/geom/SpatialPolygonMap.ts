// Migrated from namespace Geom to ES module
import { IPolygon, IPoint, IPolygonBase } from './IGeom';
import { EventDispatcher, EventType } from '../models/Events';

export interface IContainer<T> extends Array<T> {}

export interface IPolygonMap<K extends IPolygonBase> {
  addPolygon(poly: K): void;
  getPolygonFromPoint(pt: IPoint): K | undefined;
  getContainerFromPoint(pt: IPoint): IContainer<K> | undefined;
}

export class SpatialPolygonMap<T extends IPolygonBase, K extends IPolygonBase = T> extends EventDispatcher<T> implements IPolygonMap<K> {
  public items!: Map<number, K>;
  protected itemsPolygonIDs!: Map<number, number>;
  protected containers!: Map<number, IContainer<K>>;
  protected polygonsByID!: Map<number, T>;
  protected polygonsSortedByArea!: Array<T>;

  public init(): this {
    this.reset();
    return this;
  }

  public reset(): void {
    super.reset();

    this.items = new Map();
    this.itemsPolygonIDs = new Map();
    this.containers = new Map();
    this.polygonsByID = new Map();
    this.polygonsSortedByArea = [];
  }

  public getOutermostPolygon(): T {
    return this.polygonsSortedByArea[this.polygonsSortedByArea.length - 1];
  }

  public getPolygonFromPoint(pt: IPoint, includeInverted: boolean = false): K | undefined {
    for (let i = 0; i < this.polygonsSortedByArea.length; i++) {
      let poly = this.polygonsSortedByArea[i];
      if ((poly as any).inverted && !includeInverted) {
        continue;
      }
      // TODO: Implement pointInPolygon
      // if (pointInPolygon(pt, poly)) {
      //   return poly as K;
      // }
    }
    return undefined;
  }

  protected getPolygonId(pt: IPoint): number {
    let poly = this.getPolygonFromPoint(pt);
    if (poly) {
      return poly.id;
    }
    return -1;
  }

  public getContainerFromPoint(pt: IPoint): IContainer<K> | undefined {
    let polygonId = this.getPolygonId(pt);
    if (polygonId >= 0) {
      return this.containers.get(polygonId) || [];
    }
    return undefined;
  }

  public addPolygon(poly: K): void {
    this.polygonsByID.set(poly.id, poly as unknown as T);
    this.containers.set(poly.id, []);
    this.polygonsSortedByArea.push(poly as unknown as T);
    this.polygonsSortedByArea.sort((a, b) => (a.area ?? 0) - (b.area ?? 0));
  }

  public addItem(item: K): boolean {
    if (!this.itemsPolygonIDs.has(item.id)) {
      let polygonID = this.getPolygonId(item.bounds.anchor);
      this.itemsPolygonIDs.set(item.id, polygonID);
      if (polygonID >= 0) {
        if (!this.containers.has(polygonID)) {
          this.containers.set(polygonID, []);
        }
        this.containers.get(polygonID)!.push(item);
      }
      this.items.set(item.id, item);
      return true;
    }
    return false;
  }

  public removeItem(item: K): boolean {
    if (this.itemsPolygonIDs.has(item.id)) {
      let polygonID = this.itemsPolygonIDs.get(item.id)!;
      if (polygonID > 0) {
        let container = this.containers.get(polygonID);
        if (container) {
          let idx = container.indexOf(item);
          if (idx !== -1) container.splice(idx, 1);
        }
      }
      this.itemsPolygonIDs.delete(item.id);
      this.items.delete(item.id);
      return true;
    }
    return false;
  }

  public updateItem(item: K): boolean {
    let polygonID = this.getPolygonId(item.bounds.anchor);
    let prevPolygonID = this.itemsPolygonIDs.get(item.id);
    if (polygonID != prevPolygonID) {
      this.removeItem(item);
      this.addItem(item);
      if (prevPolygonID !== undefined && prevPolygonID >= 0) {
        const prevPoly = this.polygonsByID.get(prevPolygonID);
        if (prevPoly) this.dispatch(EventType.Remove, prevPoly, item);
      }
      if (polygonID >= 0) {
        const poly = this.polygonsByID.get(polygonID);
        if (poly) this.dispatch(EventType.Add, poly, item);
      }
      return true;
    }
    return false;
  }

  public getPolygonByItemID(itemID: number): T | undefined {
    let polygonID = this.itemsPolygonIDs.get(itemID);
    if (polygonID !== undefined && polygonID >= 0) {
      return this.polygonsByID.get(polygonID);
    }
    return undefined;
  }

  public getItemsWithinPolygonID(polygonID: number): IContainer<K> | undefined {
    return this.containers.get(polygonID) || [];
  }

  public get itemsArray(): K[] {
    return Array.from(this.items.values());
  }
}