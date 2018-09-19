namespace Geom {


  export interface IPolygonMap<T> {

    addPolygon(poly:(IPolygon & Util.Identifiable)):void;
    getPolygonFromPoint (pt:IPoint):(IPolygon & Util.Identifiable);
    getContainerFromPoint (pt:IPoint):Util.IContainer<T>;

  }

  export class SpatialPolygonMap<T extends IPolygon & Util.Identifiable, K extends Util.Identifiable & ISpatial> implements IPolygonMap<K>, Util.ICollection<K> {

    public items:Array<K>;
    protected itemsPolygonIDs:Array<number>;
    protected containers:Array<Util.IContainer<K>>;
    protected polygonsByID:Array<T>;
    protected polygonsSortedByArea:Array<T>;
    
    public init ():any {

      this.reset();
      return this;

    }

    public reset ():void {

      this.items = [];
      this.itemsPolygonIDs = [];
      this.containers = [];
      this.polygonsByID = [];
      this.polygonsSortedByArea = [];

    }

    public getPolygonFromPoint (pt:IPoint):T {

      for (let i = 0; i < this.polygonsSortedByArea.length; i++) {

        let poly = this.polygonsSortedByArea[i];

        if (poly.inverted) {
          // don't allow items in inverted polys
          continue;
        }

        if (pointInPolygon(pt, poly)) {

          return poly;

        }

      }

    }

    protected getPolygonId (pt:IPoint):number {

      let poly = this.getPolygonFromPoint(pt);

      if (poly) {
        return poly.id;
      }

      return -1;

    }

    public getContainerFromPoint (pt:IPoint):Util.IContainer<K> {
      
      let polygonId = this.getPolygonId(pt);

      if (polygonId >= 0) {

        return this.containers[polygonId];

      }

    }

    public addPolygon (poly:T):void {

      this.polygonsByID[poly.id] = poly;
      this.containers[poly.id] = []

      // keep sorted by area

      this.polygonsSortedByArea.push(poly);

      this.polygonsSortedByArea.sort((a, b) => {

        let aa = a.area;
        let ba = b.area;

        if (aa > ba) {
          return 1;
        } else if (aa < ba) {
          return -1;
        }

        return 0;

      });

      
    }

    public addItem (item:K):boolean {

      if (this.itemsPolygonIDs[item.id] == null) {

        let polygonID = this.getPolygonId(item.bounds.anchor);

        this.itemsPolygonIDs[item.id] = polygonID;

        if (polygonID >= 0) {

          if (this.containers[polygonID] == null) {
            this.containers[polygonID] = [];
          }

          this.containers[polygonID].push(item);

        }

        return true;

      }

      return false;

    }

    public removeItem (item:K):boolean {

      if (!isNaN(this.itemsPolygonIDs[item.id])) {

        let polygonID = this.itemsPolygonIDs[item.id];

        if (polygonID > 0) {

          let container = this.containers[polygonID];

          if (container && container.indexOf(item) != -1) {
            container.splice(container.indexOf(item), 1);
          }

        }

        this.itemsPolygonIDs[item.id] = null;
        return true;

      }

      return false;
      
    }

    public updateItem (item:K):boolean {

      let polygonID = this.getPolygonId(item.bounds.anchor);
      
      if (polygonID != this.itemsPolygonIDs[item.id]) {
        this.removeItem(item);
        this.addItem(item);
        return true;
      }

      return false;

    }

    public getItemPolygon (item:K):T {

      let polygonID = this.itemsPolygonIDs[item.id];

      if (polygonID >= 0) {
        return this.polygonsByID[polygonID];
      }

    }

  }

}