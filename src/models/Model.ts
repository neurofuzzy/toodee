namespace Models {

  export class Model implements Util.IModel<Util.IModelItem> {

    public items:Array<Item>;
    public testRay:Geom.ISegment;

    constructor () {

      this.reset();

    }

    public init ():Model {

      return this;

    }

    public reset ():void {

      this.items = [];
      this.testRay = new Geom.Segment(0, 0, 100, 100);

    }

    public addItem (item:Item):boolean {

      if (item.id < 0 || this.items[item.id] != undefined) {
        return false;
      }

      this.items[item.id] = item;
      
      return true;

    }

    public removeItem (item:Item):boolean {

      return false;

    }

  }

}