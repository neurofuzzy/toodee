namespace Util {

  export interface IModel<T extends Identifiable> {
    items:Array<T>;
    init():IModel<T>;
    reset():void;
    addItem(item:T):boolean;
    removeItem(item:T):boolean;
  }

}