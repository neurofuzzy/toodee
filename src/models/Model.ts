namespace Models {

  export class Model implements Util.IModel<Item> {

    public items:Array<Item>;

    constructor () {
      this.items = [];
    }

    public init () {
      return this;
    }

    public build () {

      for (let i = 0; i < 100; i++) {
  
        var x = Math.random() * 640;
        var y = Math.random() * 640;
  
        var item = new Item();
        item.x = x;
        item.y = y;
        item.w = Math.random() * 10 + 10;
        item.h = Math.random() * 10 + 10;
  
        this.items.push(item);
  
      }
  
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