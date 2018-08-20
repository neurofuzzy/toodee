namespace Util {

  export interface IModel<T> {
    items:Array<T>;
    init():IModel<T>;
  }

}