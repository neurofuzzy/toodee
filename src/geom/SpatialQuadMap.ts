namespace Geom {

  export interface ISpatialQuad extends Array<ISpatial> {

  }

  export class SpatialQuadMap implements Util.IModel<Util.IModelItem & ISpatial> {

    protected quadSize:number;
    protected itemsQuadIndexes:Array<number>;
    protected quads:Array<ISpatialQuad>;

    protected bufferPt:IPoint;
    protected bufferArr:Array<ISpatialQuad>;

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

    public get items ():Array<Util.IModelItem & ISpatial> {

      var outArr:Array<Util.IModelItem & ISpatial> = [];

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

      x += 100;
      y += 100;
      return y * 1000 + x;

    }

    protected getQuad (x:number, y:number):ISpatialQuad {

      return this.quads[this.getQuadIndex(x, y)];

    }

    public addItem (item:(Util.IModelItem & ISpatial)):boolean {
      
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

    public removeItem (item:(Util.IModelItem & ISpatial)):boolean {

      if (this.itemsQuadIndexes[item.id] != null) {

        var qidx = this.itemsQuadIndexes[item.id];
        var quad = this.quads[qidx];
        quad.splice(quad.indexOf(item), 1);
        this.itemsQuadIndexes[item.id] = null;

        return true;

      }

      return false;
      
    }

    public updateItem (item:(Util.IModelItem & ISpatial)) {

      var qcoords = this.getQuadCoords(item);
      var qidx = this.getQuadIndex(qcoords.x, qcoords.y);
      
      if (qidx != this.itemsQuadIndexes[item.id]) {
        this.removeItem(item);
        this.addItem(item);
      }

    }

    public getSurroundingQuads (item:(Util.IModelItem & ISpatial)):Array<ISpatialQuad> {

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

    public getQuadsFromCoords (coords:Array<IPoint>, removeDupes:boolean = false):Array<ISpatialQuad> {

      var matchingQuads:Array<ISpatialQuad> = [];

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

  }

}