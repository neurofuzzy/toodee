namespace Geom {

  export interface ISegmentQuad extends Array<ISegment> {

  }

  export class SegmentQuadMap implements Util.IModel<Util.IModelItem & ISegment> {

    protected quadSize:number;
    protected segmentThickness:number;
    protected itemsQuadIndexes:Array<Array<number>>;
    protected quads:Array<ISegmentQuad>;

    protected bufferPt:IPoint;
    protected bufferArr:Array<ISegmentQuad>;

    constructor (quadSize:number = 100, segmentThickness:number = 0) {

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

    public get items ():Array<Util.IModelItem & ISegment> {

      var outArr:Array<Util.IModelItem & ISegment> = [];

      // TODO: return items if necessary

      return outArr;

    }

    protected getQuadCoords (item:ISegment):Array<IPoint> {

      return Geom.gridPointsAlongLineWithThickness(item.ptA.x, item.ptA.y, item.ptB.x, item.ptB.y, this.quadSize, this.segmentThickness);

    }

    protected getQuadIndex (x:number, y:number):number {

      x += 100;
      y += 100;
      return y * 1000 + x;

    }

    protected getQuad (x:number, y:number):ISegmentQuad {

      return this.quads[this.getQuadIndex(x, y)];

    }

    public addItem (item:(Util.IModelItem & ISegment)):boolean {
      
      if (this.itemsQuadIndexes[item.id] == null) {

        var qcoords = this.getQuadCoords(item);

        qcoords.forEach(qcoord => {

          var qidx = this.getQuadIndex(qcoord.x, qcoord.y);

          if (this.quads[qidx] == null) {
            this.quads[qidx] = [];
          }

          if (this.itemsQuadIndexes[item.id] == null) {
            this.itemsQuadIndexes[item.id] = [];
          }

          this.itemsQuadIndexes[item.id].push(qidx);
          this.quads[qidx].push(item);

        });

        return true;

      }

      return false;

    }

    public removeItem (item:(Util.IModelItem & ISegment)):boolean {

      if (this.itemsQuadIndexes[item.id] != null) {

        var qidxs = this.itemsQuadIndexes[item.id];

        qidxs.forEach(qidx => {
          var quad = this.quads[qidx];
          quad.splice(quad.indexOf(item), 1);
          this.itemsQuadIndexes[item.id] = null;
        });

        return true;

      }

      return false;
      
    }

    public updateItem (item:(Util.IModelItem & ISegment)) {

      this.removeItem(item);
      this.addItem(item);

    }

    public getQuadFromPoint (pt:IPoint, removeDupes:boolean = false):ISegmentQuad {

      var idx = this.getQuadIndex(pt.x, pt.y);
      return this.quads[idx];
      
    }

  }

}