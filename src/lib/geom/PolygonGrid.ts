namespace Geom {

  export interface ISegmentCell extends ICell<ISegment> {
 
  }

  export class PolygonGrid<T extends Util.Identifiable & IPolygon> implements IGrid<T>, Util.ICollection<T> {

    protected cellSize:number;
    protected segmentThickness:number;
    protected itemsCellIndexes:Array<Array<number>>;
    protected cells:Array<ISegmentCell>;

    constructor (cellSize:number = 100, segmentThickness:number = 0) {

      this.cellSize = cellSize;
      this.segmentThickness = segmentThickness;

    }

    public init ():any {

      this.reset();
      return this;

    }

    public reset ():void {

      this.itemsCellIndexes = [];
      this.cells = [];

    }

    public get items ():Array<T> {

      var outArr:Array<T> = [];

      // TODO: return items if necessary

      return outArr;

    }

    protected getCellCoords (item:ISegment):Array<IPoint> {

      return cellCoordsAlongLineWithThickness(item.ptA.x, item.ptA.y, item.ptB.x, item.ptB.y, this.cellSize, this.segmentThickness);

    }

    protected getCellIndex (x:number, y:number):number {

      return Util.Pairing.cantorPair(x + 1000, y + 1000); // doesn't work for non-negative numbers, so pad for now

    }

    protected getCell (x:number, y:number):ISegmentCell {

      return this.cells[this.getCellIndex(x, y)];

    }

    public addItem (item:T):boolean {

      if (this.itemsCellIndexes[item.id] == null) {

        this.itemsCellIndexes[item.id] = [];

        item.segments.forEach(seg => { 
      
          var coords = this.getCellCoords(seg);

          coords.forEach(coord => {

            var cidx = this.getCellIndex(coord.x, coord.y);

            if (this.cells[cidx] == null) {
              this.cells[cidx] = [];
            }

            this.itemsCellIndexes[item.id].push(cidx);
            this.cells[cidx].push(seg);

          });

        });

        return true;

      }

      return false;


    }

    public removeItem (item:T):boolean {

      if (this.itemsCellIndexes[item.id] != null) {

        item.segments.forEach(seg => { 

          var cidxs = this.itemsCellIndexes[item.id];

          cidxs.forEach(cidx => {
            var cell = this.cells[cidx];
            cell.splice(cell.indexOf(seg), 1);
          });

        });

        this.itemsCellIndexes[item.id] = null;

        return true;

      }

      return false;
      
    }

    public updateItem (item:(T)) {

      this.removeItem(item);
      this.addItem(item);

    }

    public getCellFromPoint (pt:IPoint):ISegmentCell {

      var idx = this.getCellIndex(Math.floor(pt.x / this.cellSize), Math.floor(pt.y / this.cellSize));
      return this.cells[idx];
      
    }

    public getCellsFromCoords (coords:Array<IPoint>, removeDupes:boolean = false):Array<ISegmentCell> {

      var matchingCells:Array<ISegmentCell> = [];

      coords.forEach(coord => {
        var idx = this.getCellIndex(coord.x, coord.y);
        var cell = this.cells[idx];
        if (cell != null) {
          if (!removeDupes || matchingCells.indexOf(cell) == -1) {
            matchingCells.push(cell);
          }
        }
      });

      return matchingCells;

    }

  }

}