namespace Models {

  export interface IView<T> {

    initWithModel(model:T):any;
    update():void;

  }

}