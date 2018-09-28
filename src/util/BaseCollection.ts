namespace Util {

  export class BaseCollection<T extends Util.Identifiable> extends EventDispatcher implements Util.ICollection<T> {

    public items:Array<Identifiable & T>;

    constructor () {

      super();

    }

    public init ():any {

      this.reset();
      return this;

    }

    public reset ():void {

      super.reset();
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
      this.dispatch(EventType.Add, item);
      
      return true;

    }

    public removeItem (item:T):boolean {

      if (item.id >= 0 && this.items[item.id] != undefined) {

        this.items[item.id] = null;
        this.dispatch(EventType.Remove, item);
        
        return true;

      }

      return false;

    }

  }

}