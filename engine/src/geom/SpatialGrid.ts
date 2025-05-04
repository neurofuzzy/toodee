// Migrated from namespace Geom to ES module
import { ISpatial } from './ISpatial';
import { IGrid } from './IGrid';
import { Point } from './BaseGeom';
import { IPoint } from './IGeom';
import { cantorPair } from '../util/Pairing';
import { SHAPE_ORTHO, distanceBetween, pointWithinBounds } from './Helpers';

export class SpatialGrid<T extends { id: number; bounds: any } & ISpatial> implements IGrid<T> {
  protected cellSize: number;
  protected itemsCellIndexes!: Map<number, number>;
  protected cells!: Map<number, Array<T>>;
  protected bufferPt!: IPoint;
  protected bufferArr!: Array<Array<T>>;

  constructor(cellSize: number = 100) {
    this.cellSize = cellSize;
  }

  public init(): this {
    this.reset();
    return this;
  }

  public reset(): void {
    this.itemsCellIndexes = new Map();
    this.cells = new Map();
    this.bufferPt = new Point();
    this.bufferArr = [];
  }

  public get items(): Array<T> {
    const outArr: Array<T> = [];
    // TODO: return items if necessary
    return outArr;
  }

  protected getCellCoords(item: ISpatial): IPoint {
    const pt = this.bufferPt;
    pt.x = Math.floor(item.bounds.anchor.x / this.cellSize);
    pt.y = Math.floor(item.bounds.anchor.y / this.cellSize);
    return pt;
  }

  protected getCellIndex(x: number, y: number): number {
    return cantorPair(x + 1000, y + 1000);
  }

  protected getCell(x: number, y: number): Array<T> {
    return this.cells.get(this.getCellIndex(x, y)) || [];
  }

  public addItem(item: T): boolean {
    if (!this.itemsCellIndexes.has(item.id)) {
      const coords = this.getCellCoords(item);
      const cidx = this.getCellIndex(coords.x, coords.y);
      if (!this.cells.has(cidx)) {
        this.cells.set(cidx, []);
      }
      this.itemsCellIndexes.set(item.id, cidx);
      this.cells.get(cidx)!.push(item);
      return true;
    }
    return false;
  }

  public removeItem(item: T): boolean {
    if (this.itemsCellIndexes.has(item.id)) {
      const cidx = this.itemsCellIndexes.get(item.id)!;
      const cell = this.cells.get(cidx)!;
      const idx = cell.indexOf(item);
      if (idx !== -1) cell.splice(idx, 1);
      this.itemsCellIndexes.delete(item.id);
      return true;
    }
    return false;
  }

  public updateItem(item: T) {
    const coords = this.getCellCoords(item);
    const cidx = this.getCellIndex(coords.x, coords.y);
    if (cidx != this.itemsCellIndexes.get(item.id)) {
      this.removeItem(item);
      this.addItem(item);
    }
  }

  public getSurroundingCells(item: T): Array<Array<T>> {
    const pt = this.getCellCoords(item);
    const arr = this.bufferArr;
    arr[0] = this.getCell(pt.x, pt.y);
    arr[1] = this.getCell(pt.x, pt.y - 1);
    arr[2] = this.getCell(pt.x, pt.y + 1);
    arr[3] = this.getCell(pt.x - 1, pt.y);
    arr[4] = this.getCell(pt.x + 1, pt.y);
    arr[5] = this.getCell(pt.x - 1, pt.y - 1);
    arr[6] = this.getCell(pt.x + 1, pt.y - 1);
    arr[7] = this.getCell(pt.x - 1, pt.y + 1);
    arr[8] = this.getCell(pt.x + 1, pt.y + 1);
    return arr;
  }

  public getCellFromPoint(pt: IPoint): Array<T> {
    const idx = this.getCellIndex(Math.floor(pt.x / this.cellSize), Math.floor(pt.y / this.cellSize));
    return this.cells.get(idx) || [];
  }

  public getCellItems(x: number, y: number): T[] {
    return this.cells.get(this.getCellIndex(x, y)) || [];
  }

  public getCellItemsByIndex(idx: number): T[] {
    return this.cells.get(idx) || [];
  }

  public getCellsFromCoords(coords: Array<IPoint>, removeDupes: boolean = false): T[] {
    let cells: T[] = [];
    let seen: Set<T> | null = removeDupes ? new Set<T>() : null;
    for (let pt of coords) {
      let cell = this.getCellItems(Math.floor(pt.x), Math.floor(pt.y));
      for (let item of cell) {
        if (!removeDupes || (seen && !seen.has(item))) {
          cells.push(item);
          if (removeDupes && seen) seen.add(item);
        }
      }
    }
    return cells;
  }

  public getCellsNear(center: IPoint, radius: number): Array<Array<T>> {
    // TODO: Implement cellCoordsIntersectingCircle and import if needed
    return [];
  }

  public getItemsUnderPoint(pt: IPoint): Array<T> {
    let items: Array<T> = [];
    let cells = this.getCellsNear(pt, this.cellSize * 0.25);
    if (!cells) return items;
    cells.forEach(cell => {
      if (!cell) return;
      cell.forEach(item => {
        if (item.bounds.shape == SHAPE_ORTHO) {
          if (pointWithinBounds(pt.x, pt.y, item.bounds)) {
            items.push(item);
          }
        } else {
          if (distanceBetween(pt.x, pt.y, item.bounds.anchor.x, item.bounds.anchor.y) < item.bounds.hw) {
            items.push(item);
          }
        }
      });
    });
    return items;
  }

  public getItemsNear(center: IPoint, radius: number): Array<T> {
    let items: Array<T> = [];
    let cells = this.getCellsNear(center, radius);
    if (!cells) return items;
    cells.forEach(cell => {
      if (!cell) return;
      cell.forEach(item => {
        if (distanceBetween(center.x, center.y, item.bounds.anchor.x, item.bounds.anchor.y) <= radius) {
          items.push(item);
        }
      })
    });
    return items;
  }
}