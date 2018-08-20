namespace Util {

  export interface IController {

    initWithModelAndView(model:IModel<any>, view:IView):IController;
    start();
    update();
    stop();

  }

}