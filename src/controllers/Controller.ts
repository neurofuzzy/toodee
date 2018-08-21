namespace Controllers {

  export class Controller implements Util.IController {

    protected model:Util.IModel<Geom.ISpatial>;
    protected view:Util.IView

    public initWithModelAndView(model:Util.IModel<Geom.ISpatial>, view:Util.IView):Controller {

      this.model = model;
      this.view = view;

      return this;

    }

    protected build () {

      for (let i = 0; i < 100; i++) {
  
        var x = 200 + Math.random() * 400;
        var y = 100 + Math.random() * 400;
  
        var item = new Models.Item().initWithPositionAndSize(
          x, 
          y, 
          Math.random() * 10 + 10, 
          Math.random() * 10 + 10
        );

        this.model.addItem(item);
  
      }
  
  
    }

    public start () {

      console.log("starting...");
      this.build();

      this.view.ticker.add(this.update);

    }

    private countIntersections (item:Geom.IRect) {

    }

    public update = () => {

      this.model.items.forEach(item => {
        item.position.x += Math.random() - 0.5;
        item.position.y += Math.random() - 0.5;
      });

      this.view.update();

    }

    public stop () {

      console.log("stopping...");

      this.view.ticker.remove(this.update);

    }

  }

}