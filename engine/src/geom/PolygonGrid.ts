import { IGrid, ICell } from './IGrid';
import { IPolygon, ISegment, IPoint } from './IGeom';
import { cellCoordsAlongLineWithThickness } from './Helpers';
import { cantorPair } from '../util/Pairing';

export interface ISegmentCell extends ICell<ISegment> {}

export class PolygonGrid<T extends { id: number; segments: ISegment[] } & IPolygon> implements IGrid<T> {
  protected cellSize: number;
  protected segmentThickness: number;
  protected itemsCellIndexes: Map<number, Array<number>>;
  protected cells: Map<number, ISegmentCell>;

  constructor(cellSize: number = 100, segmentThickness: number = 0) {
    this.cellSize = cellSize;
    this.segmentThickness = segmentThickness;
  }

  public init(): this {
    this.reset();
    return this;
  }

  public reset(): void {
    this.itemsCellIndexes = new Map();
    this.cells = new Map();
  }

  public get items(): Array<T> {
    const outArr: Array<T> = [];
    // TODO: return items if necessary
    return outArr;
  }

  protected getCellCoords(item: ISegment): Array<IPoint> {
    return cellCoordsAlongLineWithThickness(item.ptA.x, item.ptA.y, item.ptB.x, item.ptB.y, this.cellSize, this.segmentThickness);
  }

  protected getCellIndex(x: number, y: number): number {
    return cantorPair(x + 1000, y + 1000);
  }

  protected getCell(x: number, y: number): ISegmentCell {
    return this.cells.get(this.getCellIndex(x, y));
  }

  public addItem(item: T): boolean {
    if (!this.itemsCellIndexes.has(item.id)) {
      this.itemsCellIndexes.set(item.id, []);
      item.segments.forEach(seg => {
        const coords = this.getCellCoords(seg);
        coords.forEach(coord => {
          const cidx = this.getCellIndex(coord.x, coord.y);
          if (!this.cells.has(cidx)) {
            this.cells.set(cidx, [] as unknown as ISegmentCell);
          }
          this.itemsCellIndexes.get(item.id)!.push(cidx);
          (this.cells.get(cidx)! as unknown as ISegment[]).push(seg);
        });
      });
      return true;
    }
    return false;
  }

  public removeItem(item: T): boolean {
    if (this.itemsCellIndexes.has(item.id)) {
      item.segments.forEach(seg => {
        const cidxs = this.itemsCellIndexes.get(item.id)!;
        cidxs.forEach(cidx => {
          const cell = this.cells.get(cidx)!;
          const idx = (cell as unknown as ISegment[]).indexOf(seg);
          if (idx !== -1) (cell as unknown as ISegment[]).splice(idx, 1);
        });
      });
      this.itemsCellIndexes.delete(item.id);
      return true;
    }
    return false;
  }

  public updateItem(item: T) {
    this.removeItem(item);
    this.addItem(item);
  }

  public getCellFromPoint(pt: IPoint): ISegmentCell {
    const idx = this.getCellIndex(Math.floor(pt.x / this.cellSize), Math.floor(pt.y / this.cellSize));
    return this.cells.get(idx);
  }

  public getCellsFromCoords(coords: Array<IPoint>, removeDupes: boolean = false): Array<ISegmentCell> {
    const matchingCells: Array<ISegmentCell> = [];
    const seen = removeDupes ? new Set<ISegmentCell>() : null;
    coords.forEach(coord => {
      const idx = this.getCellIndex(coord.x, coord.y);
      const cell = this.cells.get(idx);
      if (cell != null) {
        if (!removeDupes || !seen.has(cell)) {
          matchingCells.push(cell);
          if (removeDupes) seen.add(cell);
        }
      }
    });
    return matchingCells;
  }
}