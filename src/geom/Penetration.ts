namespace Geom {

  var pt:Point = new Point();

  function getPenetrationBetweenBounds(bA:IBounds, bB:IBounds):IPoint {

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

  function getPenetrationRoundRound(bA:IBounds, bB:IBounds):IPoint {

    pt.x = pt.y = 0;

    var dist = Geom.distanceBetween(bA.anchor.x, bA.anchor.y, bB.anchor.x, bB.anchor.y) - Math.min(bA.hw, bA.hh) - Math.min(bB.hw, bB.hh);

    if (dist < 0) {

      var delta = 0 - dist;
      var angle = Geom.angleBetween(bA.anchor.x, bA.anchor.y, bB.anchor.x, bB.anchor.y);

      if (angle < 0) angle += Math.PI * 2;

      pt.x = delta * Math.cos(angle);
      pt.y = delta * Math.sin(angle);

    } 

    return pt;

  }

  export function resolvePenetrationBetweenBounds(bA:IBounds, bB:IBounds, useShapes:boolean = false):void {

    if (!useShapes || (bA.shape == SHAPE_ORTHO && bB.shape == SHAPE_ORTHO)) {

      let pt = getPenetrationBetweenBounds(bA, bB);

      var aA = bA.anchor;
      var aB = bB.anchor;

      var hx = pt.x * 0.5;
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

    } else if (bA.shape == bB.shape) {

      resolvePenetrationRoundRound(bA, bB);

    } else {

      resolvePenetrationOrthoRound(bA, bB);

    }

  }

  function resolvePenetrationRoundRound(bA:IBounds, bB:IBounds):void {

    let pt = getPenetrationRoundRound(bA, bB);

    var deltaX = pt.x * 0.5;
    var deltaY = pt.y * 0.5;

    bA.anchor.x += deltaX
    bA.anchor.y += deltaY;
    bB.anchor.x -= deltaX;
    bB.anchor.y -= deltaY;

  }

  function resolvePenetrationOrthoRound(bA:IBounds, bB:IBounds):void {

    var orthob = bA;
    var circleb = bB;

    if (bA.shape > bB.shape) {
      orthob = bB;
      circleb = bA;
    }

    var cx = circleb.anchor.x;
    var cy = circleb.anchor.y;
    var radius = Math.min(circleb.hw, circleb.hh);
    var cx1 = cx - radius;
    var cy1 = cy - radius;
    var cx2 = cx + radius;
    var cy2 = cy + radius;

    var rx1 = orthob.anchor.x - orthob.hw;
    var ry1 = orthob.anchor.y - orthob.hh;
    var rx2 = orthob.anchor.x + orthob.hw;
    var ry2 = orthob.anchor.y + orthob.hh;
    var rx = (rx1 + rx2) * 0.5;
    var ry = (ry1 + ry2) * 0.5;

    // bounds check, early out

    if (rx2 < cx1 || ry2 < cy1 || rx1 > cx2 || ry1 > cy2) {
      return;
    }

    // if inside rect

    if (rx2 > cx && ry2 > cy && rx1 < cx && ry1 < cy) {
      return;
    }

    var delta, angle;

    if (cx >= rx1 && cx <= rx2) {

      if (cy <= ry) {
        circleb.anchor.y = ry1 - radius;
      } else {
        circleb.anchor.y = ry2 + radius;
      }
      return;

    } else if (cy >= ry1 && cy <= ry2) {

      if (cx <= rx) {
        circleb.anchor.x = rx1 - radius;
      } else {
        circleb.anchor.x = rx2 + radius;
      }
      return;

    } else if (cx < rx1 && cy < ry1) {

      delta = Geom.distanceBetween(cx, cy, rx1, ry1);
      angle = Geom.angleBetween(cx, cy, rx1, ry1);

    } else if (cx > rx2 && cy < ry1) {

      delta = Geom.distanceBetween(cx, cy, rx2, ry1);
      angle = Geom.angleBetween(cx, cy, rx2, ry1);

    } else if (cx > rx2 && cy > ry2) {

      delta = Geom.distanceBetween(cx, cy, rx2, ry2);
      angle = Geom.angleBetween(cx, cy, rx2, ry2);

    } else {

      delta = Geom.distanceBetween(cx, cy, rx1, ry2);
      angle = Geom.angleBetween(cx, cy, rx1, ry2);

    }

    if (angle < 0) angle += Math.PI * 2;

    if (delta < radius) {

      delta -= radius;

      circleb.anchor.x += delta * Math.cos(angle);
      circleb.anchor.y += delta * Math.sin(angle);

    }

  }

}

