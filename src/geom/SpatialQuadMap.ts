namespace Geom {

  export class SpatialQuadMap<T extends Util.Identifiable & ISpatial> implements IQuadMap<T>, Util.ICollection<T> {

    protected quadSize:number;
    protected itemsQuadIndexes:Array<number>;
    protected quads:Array<Array<T>>;

    protected bufferPt:IPoint;
    protected bufferArr:Array<Array<T>>;

    constructor (quadSize:number = 100) {

      this.quadSize = quadSize;

    }

    public init ():any {

      this.reset();
      return this;

    }

    public reset ():void {

      this.itemsQuadIndexes = [];
      this.quads = [];
      this.bufferPt = new Point();
      this.bufferArr = []; 

    }

    public get items ():Array<T> {

      var outArr:Array<T> = [];

      // TODO: return items if necessary

      return outArr;

    }

    protected getQuadCoords (item:ISpatial):IPoint {

      var pt = this.bufferPt;
      
      pt.x = Math.floor(item.bounds.anchor.x / this.quadSize);
      pt.y = Math.floor(item.bounds.anchor.y / this.quadSize);

      return pt;

    }

    protected getQuadIndex (x:number, y:number):number {

      return Util.Pairing.cantorPair(x + 1000, y + 1000); // doesn't work for non-negative numbers, so pad for now

    }

    protected getQuad (x:number, y:number):Array<T> {

      return this.quads[this.getQuadIndex(x, y)];

    }

    public addItem (item:T):boolean {
      
      if (this.itemsQuadIndexes[item.id] == null) {

        var qcoords = this.getQuadCoords(item);
        var qidx = this.getQuadIndex(qcoords.x, qcoords.y);

        if (this.quads[qidx] == null) {
          this.quads[qidx] = [];
        }

        this.itemsQuadIndexes[item.id] = qidx;
        this.quads[qidx].push(item);

        return true;

      }

      return false;

    }

    public removeItem (item:(T)):boolean {

      if (this.itemsQuadIndexes[item.id] != null) {

        var qidx = this.itemsQuadIndexes[item.id];
        var quad = this.quads[qidx];
        quad.splice(quad.indexOf(item), 1);
        this.itemsQuadIndexes[item.id] = null;

        return true;

      }

      return false;
      
    }

    public updateItem (item:(T)) {

      var qcoords = this.getQuadCoords(item);
      var qidx = this.getQuadIndex(qcoords.x, qcoords.y);
      
      if (qidx != this.itemsQuadIndexes[item.id]) {
        this.removeItem(item);
        this.addItem(item);
      }

    }

    public getSurroundingQuads (item:(T)):Array<Array<T>> {

      var pt = this.getQuadCoords(item);
      var arr = this.bufferArr;
      
      // center
      arr[0] = this.getQuad(pt.x, pt.y);

      // ortho
      arr[1] = this.getQuad(pt.x, pt.y - 1);
      arr[2] = this.getQuad(pt.x, pt.y + 1);
      arr[3] = this.getQuad(pt.x - 1, pt.y);
      arr[4] = this.getQuad(pt.x + 1, pt.y);

      // diag
      arr[5] = this.getQuad(pt.x - 1, pt.y - 1);
      arr[6] = this.getQuad(pt.x + 1, pt.y - 1);
      arr[7] = this.getQuad(pt.x - 1, pt.y + 1);
      arr[8] = this.getQuad(pt.x + 1, pt.y + 1);

      return arr;

    }

    public getQuadFromPoint (pt:IPoint):Array<T> {

      var idx = this.getQuadIndex(Math.floor(pt.x / this.quadSize), Math.floor(pt.y / this.quadSize));
      return this.quads[idx];
      
    }

    public getQuadsFromCoords (coords:Array<IPoint>, removeDupes:boolean = false):Array<Array<T>> {

      var matchingQuads:Array<Array<T>> = [];

      coords.forEach(coord => {
        var idx = this.getQuadIndex(coord.x, coord.y);
        var quad = this.quads[idx];
        if (quad != null) {
          if (!removeDupes || matchingQuads.indexOf(quad) == -1) {
            matchingQuads.push(quad);
          }
        }
      });

      return matchingQuads;

    }

    public getQuadsNear (center:IPoint, radius:number):Array<Array<T>> {

      var coords = Geom.gridPointsIntersectingCircle(center, radius, this.quadSize);
      return this.getQuadsFromCoords(coords, false);

    }

    public getItemsNear (center:IPoint, radius:number):Array<T> {

      let items:Array<T> = [];
      let quads = this.getQuadsNear(center, radius);

      quads.forEach(quad => {
        quad.forEach(item => {
          if (Geom.distanceBetween(center.x, center.y, item.bounds.anchor.x, item.bounds.anchor.y) <= radius) {
            items.push(item);
          }
        })
      });

      return items;

    }

  }

}