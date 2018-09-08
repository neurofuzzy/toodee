namespace Util {

  export interface IController<M, V> {

    initWithModelAndView(model:M, view:V):any;
    start();
    update();
    stop();

  }

}