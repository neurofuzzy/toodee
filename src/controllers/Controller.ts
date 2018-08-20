namespace Controllers {

  export class Controller implements Util.IController {

    protected model:Util.IModel<Util.IRenderable>;
    protected view:Util.IView

    public initWithModelAndView(model:Util.IModel<Util.IRenderable>, view:Util.IView):Controller {

      this.model = model;
      this.view = view;

      return this;

    }

    protected build () {

      for (let i = 0; i < 3000; i++) {
  
        var x = 200 + Math.random() * 400;
        var y = 100 + Math.random() * 400;
  
        var item = new Models.Item();
        item.x = x;
        item.y = y;
        item.w = Math.random() * 10 + 10;
        item.h = Math.random() * 10 + 10;
  
        this.model.items.push(item);
  
      }
  
  
    }

    public start () {

      console.log("starting...");
      this.build();

      this.view.ticker.add(this.update);

    }

    public update = () => {

      this.model.update();
      this.view.update();

    }

    public stop () {

      console.log("stopping...");

      this.view.ticker.remove(this.update);

    }

  }

}