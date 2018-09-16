namespace Geom {


  export interface IPolygonMap<T> {

    addPolygon(poly:(IPolygon & Util.IModelItem)):void;
    getPolygonFromPoint (pt:IPoint):(IPolygon & Util.IModelItem);
    getContainerFromPoint (pt:IPoint):Util.IContainer<T>;

  }

  export class SpatialPolygonMap implements IPolygonMap<ISpatial>, Util.IModel<Util.IModelItem & ISpatial> {

    public items:Array<Util.IModelItem & ISpatial>;
    protected itemsPolygonIDs:Array<number>;
    protected containers:Array<Util.IContainer<ISpatial>>;
    protected polygonsSortedByArea:Array<IPolygon & Util.IModelItem>;
    
    public init ():any {

      this.reset();
      return this;

    }

    public reset ():void {

      this.items = [];
      this.itemsPolygonIDs = [];
      this.containers = [];

    }

    public getPolygonFromPoint (pt:IPoint):(IPolygon & Util.IModelItem) {

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

    public getContainerFromPoint (pt:IPoint):Util.IContainer<ISpatial> {
      
      let polygonId = this.getPolygonId(pt);

      if (polygonId >= 0) {

        return this.containers[polygonId];

      }

    }

    public addPolygon (poly:(IPolygon & Util.IModelItem)):void {

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

    public addItem (item:(Util.IModelItem & ISpatial)):boolean {
      
      if (isNaN(this.itemsPolygonIDs[item.id])) {

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

    public removeItem (item:(Util.IModelItem & ISpatial)):boolean {

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

    public updateItem (item:(Util.IModelItem & ISpatial)) {

      let polygonID = this.getPolygonId(item.bounds.anchor);
      
      if (polygonID != this.itemsPolygonIDs[item.id]) {
        this.removeItem(item);
        this.addItem(item);
      }

    }

  }

}