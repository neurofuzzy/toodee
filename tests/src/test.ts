/// <reference path="../../engine/src/Engine.ts" />

class StartTest {

  public static engine:Engine;

  public static main():void { 

    this.engine = new Engine().init();
    console.log("HELLO!");
    let b = new Geom.Bounds(20, 20, 20, 20, Geom.SHAPE_ROUND);
    let c = new Geom.Constraints();
    this.engine.model.bodies.addItem(new Simulation.Entity().initWithBoundsAndConstraints(b, c));
    this.engine.start();

  }

}

// folderol

window.onload = function () {
  StartTest.main();
  window.document.head.setAttribute("has-main",  "yes");
}

// get parcel to refresh on TypeScript bundle export
if (document.head.getAttribute("has-main") == "yes") {
  window.location.reload();
}