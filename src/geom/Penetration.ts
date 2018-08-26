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

    var dist = Geom.distanceBetween(bA.anchor.x, bA.anchor.y, bB.anchor.x, bB.anchor.y) - bA.hw - bB.hw;

    if (dist < 0) {

      var delta = 0 - dist;
      var angle = Geom.angleBetween(bA.anchor.x, bA.anchor.y, bB.anchor.x, bB.anchor.y);

      if (angle < 0) angle += Math.PI * 2;

      pt.x = delta * Math.cos(angle);
      pt.y = delta * Math.sin(angle);

    } 

    return pt;

  }

  export function resolvePenetrationBetweenBounds(bA:IBounds, bB:IBounds, cA:IConstraints, cB:IConstraints, useShapes:boolean = false):void {

    if (!useShapes || (bA.shape == SHAPE_ORTHO && bB.shape == SHAPE_ORTHO)) {

      let pt = getPenetrationBetweenBounds(bA, bB);

      var aA = bA.anchor;
      var aB = bB.anchor;

      var hx = 0 - pt.x;
      var hy = 0 - pt.y;

      if (hx > hy) {

        if (aA.x < aB.x) {
          doResolve(hx, 0, bA, bB, cA, cB);
        } else {
          doResolve(0 - hx, 0, bA, bB, cA, cB);  
        }

      } else {

        if (aA.y < aB.y) {
          doResolve(0, hy, bA, bB, cA, cB);
        } else {
          doResolve(0, 0 - hy, bA, bB, cA, cB);     
        }

      }

    } else if (bA.shape == bB.shape) {

      resolvePenetrationRoundRound(bA, bB, cA, cB);

    } else {

      resolvePenetrationOrthoRound(bA, bB, cA, cB);

    }

  }

  function resolvePenetrationRoundRound(bA:IBounds, bB:IBounds, cA:IConstraints, cB:IConstraints):void {

    let pt = getPenetrationRoundRound(bA, bB);

    var deltaX = 0 - pt.x;
    var deltaY = 0 - pt.y;

    doResolve(deltaX, deltaY, bA, bB, cA, cB);

  }

  function resolvePenetrationOrthoRound(bA:IBounds, bB:IBounds, cA:IConstraints, cB:IConstraints):void {

    var orthob = bA;
    var circleb = bB;
    var orthoc = cA;
    var circlec = cB;

    if (bA.shape > bB.shape) {
      orthob = bB;
      circleb = bA;
      orthoc = cB;
      circlec = cA;
    }

    var cx = circleb.anchor.x;
    var cy = circleb.anchor.y;
    var radius = circleb.hw;
    var cx1 = cx - radius;
    var cy1 = cy - radius;
    var cx2 = cx + radius;
    var cy2 = cy + radius;

    var rx = orthob.anchor.x;
    var ry = orthob.anchor.y;
    var rx1 = rx - orthob.hw;
    var ry1 = ry - orthob.hh;
    var rx2 = rx + orthob.hw;
    var ry2 = ry + orthob.hh;

    // bounds check, early out

    if (rx2 < cx1 || ry2 < cy1 || rx1 > cx2 || ry1 > cy2) {
      return;
    }

    var delta, angle;
    var forceX = false;

    // if inside rect

    if (rx2 > cx && ry2 > cy && rx1 < cx && ry1 < cy) {
      
      // if penetration is greater in the x direction

      var aspect = orthob.hh / orthob.hw;

      if (Math.abs(cx - rx) * aspect > Math.abs(cy - ry) / aspect) {
        forceX = true;
      }

    }

    if (!forceX && cx >= rx1 && cx <= rx2) {

      if (cy <= ry) {
        delta = ry1 - cy - radius;
      } else {
        delta = ry2 - cy + radius;
      }

      doResolve(0, delta, circleb, orthob, circlec, orthoc);
      return;

    } else if (cy >= ry1 && cy <= ry2) {

      if (cx <= rx) {
        delta = rx1 - cx - radius;
      } else {
        delta = rx2 - cx + radius;
      }

      doResolve(delta, 0, circleb, orthob, circlec, orthoc);
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

      var deltaX = delta * Math.cos(angle);
      var deltaY = delta * Math.sin(angle);

      doResolve(deltaX, deltaY, circleb, orthob, circlec, orthoc);

    }

  }

  export function resolvePenetrationSegmentRound (segPtA:IPoint, segPtB:IPoint, b:IBounds):void {

    var a = b.anchor;
    let closestPt:IPoint = Geom.closestPtPointLine(a, segPtA, segPtB);

    let delta = Geom.distanceBetween(a.x, a.y, closestPt.x, closestPt.y);
    delta -= b.hw;
    
    if (delta < 0) {

      let angle = Geom.angleBetween(a.x, a.y, closestPt.x, closestPt.y);
      a.x += delta * Math.sin(Math.PI * 0.5 - angle);
      a.y += delta * Math.cos(Math.PI * 0.5 - angle);

    }

  }

  function doResolve (deltaX:number, deltaY:number, bA:IBounds, bB:IBounds, cA:IConstraints, cB:IConstraints):void {

    var aA = bA.anchor;
    var aB = bB.anchor;

    if (deltaX != 0 && (cA.lockX == false || cB.lockX == false)) {

      if (cA.lockX == cB.lockX) {

        aA.x += deltaX * 0.5;
        aB.x -= deltaX * 0.5;

      } else if (cA.lockX) {

        aB.x -= deltaX;

      } else {

        aA.x += deltaX;

      }

    }

    if (deltaY != 0 && (cA.lockY == false || cB.lockY == false)) {

      if (cA.lockY == cB.lockY) {

        aA.y += deltaY * 0.5;
        aB.y -= deltaY * 0.5;

      } else if (cA.lockY) {

        aB.y -= deltaY;

      } else {

        aA.y += deltaY;

      }

    }

  }

}
