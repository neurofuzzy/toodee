namespace Geom {

  var pt:Point = new Point();

  export function getPenetrationBetweenBounds(bA:IBounds, bB:IBounds):IPoint {

    pt.x = pt.y = 0;

    if (Geom.boundsIntersect(bA, bB)) {

      var aA = bA.anchor;
      var aB = bB.anchor;

      var dx = Math.abs(aA.x - aB.x) - bA.hw - bB.hw;
      var dy = Math.abs(aA.y - aB.y) - bA.hh - bB.hh;

      if (dx < 0) {
        pt.x = 0 - dx;
      }

      if (dy < 0) {
        pt.y = 0 - dy;
      }

    }

    return pt;

  }

  export function resolvePenetrationBetweenBounds(bA:IBounds, bB:IBounds):void {

    let pt = Geom.getPenetrationBetweenBounds(bA, bB);

    var aA = bA.anchor;
    var aB = bB.anchor;

    var hx = hx;
    var hy = pt.y * 0.5;

    if (hx < hy) {

      if (aA.x < aB.x) {
        aA.x -= hx;
        aB.x += hx;
      } else {
        aA.x += hx;
        aB.x -= hx;       
      }
      pt.x = 0;

    } else {

      if (aA.y < aB.y) {
        aA.y -= hy;
        aB.y += hy;
      } else {
        aA.y += hy;
        aB.y -= hy;       
      }
      pt.y = 0;

    }

  }

}