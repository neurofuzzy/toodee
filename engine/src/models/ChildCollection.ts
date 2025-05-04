/// <reference path="./Events.ts" />

// Migrated from namespace Models to ES module
import { Identifiable, IChild } from './Identity';
import { EventDispatcher, EventType } from './Events';
import { ICollection } from './ICollection';

export class ChildCollection<T extends Identifiable & IChild> extends EventDispatcher<T> implements ICollection<T> {

  public items:Map<number, T> = new Map();
  protected itemsByParentID:Map<number, T[]> = new Map();

  constructor () {

    super();

  }

  public init ():this {

    this.reset();
    return this;

  }

  public reset ():void {

    super.reset();
    this.items = new Map();
    this.itemsByParentID = new Map();
 
  }

  // Returns the first item only in order to correctly apply this interface
  public getItemByParentID (parentID:number):T | null {

    if (this.itemsByParentID.has(parentID)) {
      return this.itemsByParentID.get(parentID)?.[0] ?? null;
    }

    return null;

  }

  public getItemsByParentID (parentID:number):T[] | null {

    if (this.itemsByParentID.has(parentID)) {
      return this.itemsByParentID.get(parentID) || null;
    }

    return null;

  } 

  public addItem (item:T):boolean {

    if (this.items.has(item.id)) {
      return false;
    }

    this.items.set(item.id, item);

    let children = this.itemsByParentID.get(item.parentID);

    if (!children) {

      children = [item];
      this.itemsByParentID.set(item.parentID, children);
        
    } else {

      if (children.indexOf(item) !== -1) {
        return false;
      }
      children.push(item);
      this.itemsByParentID.set(item.parentID, children);

    }

    this.dispatch(EventType.Add, item, undefined, item);
      
    return true;

  }

  public removeItem (item:T):boolean {

    if (item.parentID >= 0) {

      let children = this.itemsByParentID.get(item.parentID);

      if (!children) {
        return false;
      }

      let childIdx = children.indexOf(item);

      if (childIdx !== -1) {
        children.splice(childIdx, 1);
        this.itemsByParentID.set(item.parentID, children);
      }

      if (this.items.has(item.id)) {
        this.items.delete(item.id);
      }
      this.dispatch(EventType.Remove, item, undefined, item);
        
      return true;

    }

    return false;

  }

  public updateItem (item:T):boolean {

    if (this.items.has(item.id)) {
      this.items.set(item.id, item);
      return true;
    }
    return false;

  }

}