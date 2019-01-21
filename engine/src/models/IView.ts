namespace Models {

  export interface IView<T> {

    initWithModel(model:T):any;
    build():void;
    update():void;

  }

}