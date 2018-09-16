namespace Geom {

  export interface ISegmentQuad extends Geom.IQuad<ISegment> {
 
  }

  export class PolygonQuadMap<T extends Util.IModelItem & IPolygon> implements IQuadMap<T>, Util.IModel<T> {

    protected quadSize:number;
    protected segmentThickness:number;
    protected itemsQuadIndexes:Array<Array<number>>;
    protected quads:Array<ISegmentQuad>;

    constructor (quadSize:number = 100, segmentThickness:number = 0) {

      this.quadSize = quadSize;
      this.segmentThickness = segmentThickness;

    }

    public init ():any {

      this.reset();
      return this;

    }

    public reset ():void {

      this.itemsQuadIndexes = [];
      this.quads = [];

    }

    public get items ():Array<T> {

      var outArr:Array<T> = [];

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

    public addItem (item:T):boolean {

      if (this.itemsQuadIndexes[item.id] == null) {

        this.itemsQuadIndexes[item.id] = [];

        item.segments.forEach(seg => { 
      
          var qcoords = this.getQuadCoords(seg);

          qcoords.forEach(qcoord => {

            var qidx = this.getQuadIndex(qcoord.x, qcoord.y);

            if (this.quads[qidx] == null) {
              this.quads[qidx] = [];
            }

            this.itemsQuadIndexes[item.id].push(qidx);
            this.quads[qidx].push(seg);

          });

        });

        return true;

      }

      return false;


    }

    public removeItem (item:T):boolean {

      if (this.itemsQuadIndexes[item.id] != null) {

        item.segments.forEach(seg => { 

          var qidxs = this.itemsQuadIndexes[item.id];

          qidxs.forEach(qidx => {
            var quad = this.quads[qidx];
            quad.splice(quad.indexOf(seg), 1);
          });

        });

        this.itemsQuadIndexes[item.id] = null;

        return true;

      }

      return false;
      
    }

    public updateItem (item:(T)) {

      this.removeItem(item);
      this.addItem(item);

    }

    public getQuadFromPoint (pt:IPoint):ISegmentQuad {

      var idx = this.getQuadIndex(Math.floor(pt.x / this.quadSize), Math.floor(pt.y / this.quadSize));
      return this.quads[idx];
      
    }

    public getQuadsFromCoords (coords:Array<IPoint>, removeDupes:boolean = false):Array<ISegmentQuad> {

      var matchingQuads:Array<ISegmentQuad> = [];

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