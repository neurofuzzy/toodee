namespace Util {

  export interface IView {

    initWithModel(model:IModel<Util.IRenderable>):IView;
    ticker:any;
    update();

  }

}