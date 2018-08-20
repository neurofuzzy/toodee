namespace Util {

  export interface IView {

    initWithModel(model:IModel<Util.IModelItem & Util.IRenderable>):IView;
    ticker:any;
    update();

  }

}