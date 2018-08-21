namespace Util {

  export interface IModel<IModelItem> {
    items:Array<IModelItem>;
    init():IModel<IModelItem>;
    reset():void;
    addItem(item:IModelItem):boolean;
    removeItem(item:IModelItem):boolean;
  }

}