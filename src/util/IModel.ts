namespace Util {

  export interface IModel<IModelItem> {
    items:Array<IModelItem>;
    init():IModel<IModelItem>;
  }

}