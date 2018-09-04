namespace Util {

  export class BaseModel<T> implements Util.IModel<Util.IModelItem & T> {

    public items:Array<IModelItem & T>;

    constructor () {

      this.reset();

    }

    public init ():any {

      return this;

    }

    public reset ():void {

      this.items = [];
 
    }

    public addItem (item:IModelItem & T):boolean {

      if (item.id < 0 || this.items[item.id] != undefined) {
        return false;
      }

      this.items[item.id] = item;
      
      return true;

    }

    public removeItem (item:IModelItem & T):boolean {

      if (item.id >= 0 && this.items[item.id] != undefined) {
        this.items[item.id] = null;
        return true;
      }

      return false;

    }

  }

}