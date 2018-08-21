namespace Util {

  export interface IView {

    initWithModel(model:IModel<Util.IModelItem & Util.ISpatial>):IView;
    ticker:any;
    update();

  }

}