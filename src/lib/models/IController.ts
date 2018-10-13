namespace Models {

  export interface IController {

    start():void;
    update():void;
    stop():void;

  }


  export interface IModelController<M> extends IController{

    initWithModel(model:M):any;

  }

  export interface IModelViewController<M, V> extends IController {

    initWithModelAndView(model:M, view:V):any;

  }

}