namespace Util {

  export interface ICollection<T extends Identifiable> {
    items:Array<T>;
    init():ICollection<T>;
    reset():void;
    addItem(item:T):boolean;
    removeItem(item:T):boolean;
  }

}