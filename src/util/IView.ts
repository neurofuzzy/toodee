namespace Util {

  export interface IView<T> {

    initWithModel(model:T):any;
    ticker:any;
    update();

  }

}