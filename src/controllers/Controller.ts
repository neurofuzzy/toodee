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
        item.id = i;
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

      this.model.items.forEach(item => {
        item.r += 0.01;
        item.x += Math.random() - 0.5;
        item.y += Math.random() - 0.5;
      });

      this.view.update();

    }

    public stop () {

      console.log("stopping...");

      this.view.ticker.remove(this.update);

    }

  }

}