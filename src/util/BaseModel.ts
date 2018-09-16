namespace Util {

  export class BaseModel<T extends Util.Identifiable> implements Util.IModel<T> {

    public items:Array<Identifiable & T>;

    constructor () {

      this.reset();

    }

    public init ():any {

      return this;

    }

    public reset ():void {

      this.items = [];
 
    }

    public getItemByID (id:number):T {

      return this.items[id];

    }

    public addItem (item:T):boolean {

      if (item.id < 0 || this.items[item.id] != undefined) {
        return false;
      }

      this.items[item.id] = item;
      
      return true;

    }

    public removeItem (item:T):boolean {

      if (item.id >= 0 && this.items[item.id] != undefined) {
        this.items[item.id] = null;
        return true;
      }

      return false;

    }

  }

}