/// <reference path="./Events.ts" />

namespace Models {

  export class BaseCollection<T extends Identifiable> extends EventDispatcher<T> implements ICollection<T> {

    public items:Array<Identifiable & T>;
    protected itemsByID:Array<Identifiable & T>;

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
      this.itemsByID = [];
 
    }

    public getItemByID (id:number):T {

      return this.itemsByID[id];

    }

    public addItem (item:T):boolean {

      if (item.id < 0 || this.itemsByID[item.id] != undefined) {
        return false;
      }

      this.items.push(item);
      this.itemsByID[item.id] = item;
      this.dispatch(EventType.Add, item, null, item);
      
      return true;

    }

    public removeItem (item:T):boolean {

      if (item.id >= 0 && this.itemsByID[item.id] != undefined) {

        this.itemsByID[item.id] = null;
        let i = this.items.indexOf(item);
        if (i >= 0) {
          this.items.splice(i, 1);
        }
        this.dispatch(EventType.Remove, item, null, item);
        
        return true;

      }

      return false;

    }

  }

}