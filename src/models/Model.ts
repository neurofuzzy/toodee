namespace Models {

  export class Model implements Util.IModel<Item> {

    public items:Array<Item>;

    constructor () {
      
      this.items = [];

    }

    public init ():Model {

      return this;

    }

    public update () {

      this.items.forEach(item => {
        item.r += 0.01;
        item.x += Math.random() - 0.5;
        item.y += Math.random() - 0.5;
      });

    }

  }

}