namespace Util {

  export interface IController {

    start();
    update();
    stop();

  }


  export interface IModelController<M> extends IController{

    initWithModel(model:M):any;

  }

  export interface IModelViewController<M, V> extends IController {

    initWithModelAndView(model:M, view:V):any;

  }

}