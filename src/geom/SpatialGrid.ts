namespace Geom {

  export class SpatialGrid<T extends Util.Identifiable & ISpatial> implements IGrid<T>, Util.ICollection<T> {

    protected cellSize:number;
    protected itemsCellIndexes:Array<number>;
    protected cells:Array<Array<T>>;

    protected bufferPt:IPoint;
    protected bufferArr:Array<Array<T>>;

    constructor (cellSize:number = 100) {

      this.cellSize = cellSize;

    }

    public init ():any {

      this.reset();
      return this;

    }

    public reset ():void {

      this.itemsCellIndexes = [];
      this.cells = [];
      this.bufferPt = new Point();
      this.bufferArr = []; 

    }

    public get items ():Array<T> {

      var outArr:Array<T> = [];

      // TODO: return items if necessary

      return outArr;

    }

    protected getCellCoords (item:ISpatial):IPoint {

      var pt = this.bufferPt;
      
      pt.x = Math.floor(item.bounds.anchor.x / this.cellSize);
      pt.y = Math.floor(item.bounds.anchor.y / this.cellSize);

      return pt;

    }

    protected getCellIndex (x:number, y:number):number {

      return Util.Pairing.cantorPair(x + 1000, y + 1000); // doesn't work for non-negative numbers, so pad for now

    }

    protected getCell (x:number, y:number):Array<T> {

      return this.cells[this.getCellIndex(x, y)];

    }

    public addItem (item:T):boolean {
      
      if (this.itemsCellIndexes[item.id] == null) {

        var coords = this.getCellCoords(item);
        var cidx = this.getCellIndex(coords.x, coords.y);

        if (this.cells[cidx] == null) {
          this.cells[cidx] = [];
        }

        this.itemsCellIndexes[item.id] = cidx;
        this.cells[cidx].push(item);

        return true;

      }

      return false;

    }

    public removeItem (item:(T)):boolean {

      if (this.itemsCellIndexes[item.id] != null) {

        var cidx = this.itemsCellIndexes[item.id];
        var cell = this.cells[cidx];
        cell.splice(cell.indexOf(item), 1);
        this.itemsCellIndexes[item.id] = null;

        return true;

      }

      return false;
      
    }

    public updateItem (item:(T)) {

      var coords = this.getCellCoords(item);
      var cidx = this.getCellIndex(coords.x, coords.y);
      
      if (cidx != this.itemsCellIndexes[item.id]) {
        this.removeItem(item);
        this.addItem(item);
      }

    }

    public getSurroundingCells (item:(T)):Array<Array<T>> {

      var pt = this.getCellCoords(item);
      var arr = this.bufferArr;
      
      // center
      arr[0] = this.getCell(pt.x, pt.y);

      // ortho
      arr[1] = this.getCell(pt.x, pt.y - 1);
      arr[2] = this.getCell(pt.x, pt.y + 1);
      arr[3] = this.getCell(pt.x - 1, pt.y);
      arr[4] = this.getCell(pt.x + 1, pt.y);

      // diag
      arr[5] = this.getCell(pt.x - 1, pt.y - 1);
      arr[6] = this.getCell(pt.x + 1, pt.y - 1);
      arr[7] = this.getCell(pt.x - 1, pt.y + 1);
      arr[8] = this.getCell(pt.x + 1, pt.y + 1);

      return arr;

    }

    public getCellFromPoint (pt:IPoint):Array<T> {

      var idx = this.getCellIndex(Math.floor(pt.x / this.cellSize), Math.floor(pt.y / this.cellSize));
      return this.cells[idx];
      
    }

    public getCellsFromCoords (coords:Array<IPoint>, removeDupes:boolean = false):Array<Array<T>> {

      var matchingCells:Array<Array<T>> = [];

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

    public getCellsNear (center:IPoint, radius:number):Array<Array<T>> {

      var coords = Geom.cellCoordsIntersectingCircle(center, radius, this.cellSize);
      return this.getCellsFromCoords(coords, false);

    }

    public getItemsNear (center:IPoint, radius:number):Array<T> {

      let items:Array<T> = [];
      let cells = this.getCellsNear(center, radius);

      cells.forEach(cell => {
        cell.forEach(item => {
          if (Geom.distanceBetween(center.x, center.y, item.bounds.anchor.x, item.bounds.anchor.y) <= radius) {
            items.push(item);
          }
        })
      });

      return items;

    }

  }

}