/// <reference path="./Events.ts" />

namespace Models {

  export class ChildCollection<T extends Identifiable & IChild> extends EventDispatcher<T> implements ICollection<T> {

    public items:Array<Identifiable & IChild & T>;
    protected itemsByParentID:Array<Array<Identifiable & IChild & T>>;

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
      this.itemsByParentID = [];
 
    }

    // Returns the first item only in order to correctly apply this interface
    public getItemByParentID (parentID:number):T {

      if (this.itemsByParentID[parentID] == null) {
        return null;
      }

      return this.itemsByParentID[parentID][0];

    }

    public getItemsByParentID (parentID:number):T[] {

      if (this.itemsByParentID[parentID] == null) {
        return null;
      }

      return this.itemsByParentID[parentID];

    } 

    public addItem (item:T):boolean {

      if (item.parentID < 0) {
        return false;
      }

      this.items.push(item);

      let children = this.itemsByParentID[item.parentID];

      if (children == null) {

        children = this.itemsByParentID[item.parentID] = [];
        
      } else {

        let childIdx = children.indexOf(item);

        if (childIdx != -1) {
          return false;
        }

      }

      children.push(item);
      this.dispatch(EventType.Add, item, null, item);
      
      return true;

    }

    public removeItem (item:T):boolean {

      if (item.parentID >= 0) {

        let children = this.itemsByParentID[item.parentID];

        if (children == null) {
          return false;
        }

        let childIdx = children.indexOf(item);

        if (childIdx != -1) {
          children.splice(childIdx, 1);
        }

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