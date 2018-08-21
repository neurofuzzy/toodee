namespace Util {

  export interface IView {

    initWithModel(model:IModel<Util.IModelItem & Geom.ISpatial>):IView;
    ticker:any;
    update();

  }

}