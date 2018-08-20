namespace Models {

  export class Model implements Util.IModel<Util.IModelItem> {

    public items:Array<Item>;

    constructor () {

      this.items = [];

    }

    public init ():Model {

      return this;

    }

  }

}