namespace Geom {

  export function pointWithinBounds(x:number, y:number, b:IBounds):boolean {

      var a = b.anchor;

      return (
        x >= a.x - b.hw &&
        y >= a.y - b.hh &&
        x <= a.x + b.hw &&
        y <= a.y + b.hh
      );

    };

  export function boundsWithinBounds(bA:IBounds, bB:IBounds):boolean {

    var aA = bA.anchor;
    var aB = bB.anchor;

    return (
      aA.x - bA.hw >= aB.x - bB.hw &&
      aA.y - bA.hh >= aB.y - bB.hh &&
      aA.x + bA.hw <= aB.x + bB.hw &&
      aA.y + bA.hh <= aB.y + bB.hh
    );

  };

  export function boundsIntersect(bA:IBounds, bB:IBounds, useShapes:boolean = false):boolean {

    var aA = bA.anchor;
    var aB = bB.anchor;

    var orthoIntersects = (
      aA.x + bA.hw >= aB.x - bB.hw &&
      aA.y + bA.hh >= aB.y - bB.hh &&
      aA.x - bA.hw <= aB.x + bB.hw &&
      aA.y - bA.hh <= aB.y + bB.hh
    );

    if (!useShapes || (bA.shape == SHAPE_ORTHO && bB.shape == SHAPE_ORTHO)) {
  
      return orthoIntersects;

    } else if (bA.shape == bB.shape) {

      if (orthoIntersects) {
      
        return Geom.distanceBetweenSquared(bA.anchor.x, bA.anchor.y, bB.anchor.x, bB.anchor.y) < (bA.hw + bB.hw) * (bA.hh + bB.hh);
      
      }

    } else {

      if (orthoIntersects) {

        return orthoRoundBoundsIntersect(bA, bB)

      }

    }

    return false;

  };

  export function distanceBetween(x1:number, y1:number, x2:number, y2:number):number {

    return Math.sqrt(Geom.distanceBetweenSquared(x1, y1, x2, y2));

  };

  export function distanceBetweenSquared(x1:number, y1:number, x2:number, y2:number):number {

    var dx = x2 - x1, dy = y2 - y1;
    return dx * dx + dy * dy;

  };

  export function angleBetween(x1:number, y1:number, x2:number, y2:number):number {

    return Math.atan2(y2 - y1, x2 - x1);

  };

  export function orthoRoundBoundsIntersect (bA:IBounds, bB:IBounds):boolean {

    var orthob = bA;
    var circleb = bB;

    if (bA.shape > bB.shape) {
      orthob = bB;
      circleb = bA;
    }

    var cx = circleb.anchor.x;
    var cy = circleb.anchor.y;
    var radius = circleb.hw;
    var cx1 = cx - radius;
    var cy1 = cy - radius;
    var cx2 = cx + radius;
    var cy2 = cy + radius;

    var rx1 = orthob.anchor.x - orthob.hw;
    var ry1 = orthob.anchor.y - orthob.hh;
    var rx2 = orthob.anchor.x + orthob.hw;
    var ry2 = orthob.anchor.y + orthob.hh;

    // bounds check, early out

    if (rx2 < cx1 || ry2 < cy1 || rx1 > cx2 || ry1 > cy2) {
      return false;
    }

    // if inside rect

    if (rx2 > cx && ry2 > cy && rx1 < cx && ry1 < cy) {
      return true;
    }

    var delta, angle;

    if (cx >= rx1 && cx <= rx2) {

      return true;

    } else if (cy >= ry1 && cy <= ry2) {

      return true;

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

    return (delta < radius);
    
  }

  export function rotatePointDeg(pt:IPoint, deg:number):void {

    Geom.rotatePoint(pt, deg * Math.PI / 180);

  };

  export function rotatePoint(pt:IPoint, angle:number):void {

    angle = 0 - Geom.normalizeAngle(angle);

    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var oldX = pt.x;
    var oldY = pt.y;

    pt.x = cos * oldX - sin * oldY;
    pt.y = sin * oldX + cos * oldY;

  };

  export function lerp(a:number, b:number, t:number):number {
    t = Math.max(0, Math.min(1, t));
    return a + (b - a) * t;
  }

  export function lerpDist(x1:number, y1:number, x2:number, y2:number, dist:number):IPoint {

    var len = Geom.distanceBetween(x1, y1, x2, y2);
    var perc = dist / len;

    return {
      x: Geom.lerp(x2, x1, perc),
      y: Geom.lerp(y2, y1, perc)
    }

  }

  export function normalizeAngle(ang:number):number {

    while (ang < 0 - Math.PI) {
      ang += Math.PI * 2;
    }

    while (ang > Math.PI) {
      ang -= Math.PI * 2;
    }

    return ang;

  }

  export function normalizeAngleDeg(ang:number):number {

    while (ang < -180) {
      ang += 360;
    }

    while (ang > 180) {
      ang -= 360;
    }

    return ang;

  }

  export function dot (ptA:IPoint, ptB:IPoint):number {

    return ptA.x * ptB.x + ptA.y * ptB.y;

  }

  export function cross (ptA:IPoint, ptB:IPoint):number {

    return ptA.x * ptB.y - ptA.y * ptB.x;

  }

  export function sub (ptA:IPoint, ptB:IPoint):IPoint {

    return {
      x: ptA.x - ptB.x,
      y: ptA.y - ptB.y,
    }

  }  
  
  export function add (ptA:IPoint, ptB:IPoint):IPoint {

    return {
      x: ptA.x + ptB.x,
      y: ptA.y + ptB.y,
    }

  }

  export function closestPtPointLine (ptC:IPoint, ptA:IPoint, ptB:IPoint):IPtDist {

    var res:IPtDist = {
      pt:null,
      dist: 0,
    };

    var ab = Geom.sub(ptB, ptA);
    var ca = Geom.sub(ptC, ptA);
    var t = Geom.dot(ca, ab);

    if (t < 0) {
      res.pt = ptA;
    } else {
      var denom = Geom.dot(ab, ab);
      if (t >= denom) {
        res.pt = ptB;
      } else {
        t /= denom;
        // reuse ca
        ca.x = ptA.x + t * ab.x;
        ca.y = ptA.y + t * ab.y;
        res.pt = ca;
      }
    }

    return res;

  }

  export function ccw(p1x:number, p1y:number, p2x:number, p2y:number, p3x:number, p3y:number):boolean {
    return (p3y - p1y) * (p2x - p1x) > (p2y - p1y) * (p3x - p1x);
  }

  export function lineIntersectsLine(p1x:number, p1y:number, p2x:number, p2y:number, p3x:number, p3y:number, p4x:number, p4y:number):boolean {
    var fn = Geom.ccw;
    return (
      fn(p1x, p1y, p3x, p3y, p4x, p4y) != fn(p2x, p2y, p3x, p3y, p4x, p4y) && 
      fn(p1x, p1y, p2x, p2y, p3x, p3y) != fn(p1x, p1y, p2x, p2y, p4x, p4y)
    );
  }

  export function lineLineIntersect(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number, x4:number, y4:number):IPoint {

    var s1_x:number, s1_y:number, s2_x:number, s2_y:number;
    s1_x = x2 - x1;
    s1_y = y2 - y1;
    s2_x = x4 - x3;
    s2_y = y4 - y3;

    var s:number, t:number;

    s = (-s1_y * (x1 - x3) + s1_x * (y1 - y3)) / (-s2_x * s1_y + s1_x * s2_y);
    t = (s2_x * (y1 - y3) - s2_y * (x1 - x3)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
      var atX = x1 + (t * s1_x);
      var atY = y1 + (t * s1_y);
      return { x: atX, y: atY };
    }

    return null;

  }

  export function lineSide(x:number, y:number, x1:number, y1:number, x2:number, y2:number):number {
    return (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1) > 0 ? 1 : -1;
  }

  export function rectIntersectsLine(b:IBounds, ax:number, ay:number, bx:number, by:number, side?:number):Array<IPoint> {

    var rx = b.anchor.x - b.hw;
    var ry = b.anchor.y - b.hh;
    var rx2 = rx + b.hw;
    var ry2 = ry + b.hh;

    // bounds check, early out

    if ((rx > ax && rx > bx) || (ry > ay && ry > by)) {
      return null;
    }

    if ((rx2 < ax && rx2 < bx) || (ry2 < ay && ry2 < by)) {
      return null;
    }

    // edge check

    var fn = Geom.lineIntersectsLine;
    var fn2 = Geom.lineSide;

    var hits = [];

    if (fn(ax, ay, bx, by, rx, ry, rx2, ry)) {

      if (isNaN(side) || fn2(ax, ay, rx, ry, rx2, ry) == side) {
        hits.push(Geom.lineLineIntersect(ax, ay, bx, by, rx, ry, rx2, ry));
      }

    }

    if (fn(ax, ay, bx, by, rx2, ry, rx2, ry2)) {

      if (isNaN(side) || fn2(ax, ay, rx2, ry, rx2, ry2) == side) {
        hits.push(Geom.lineLineIntersect(ax, ay, bx, by, rx2, ry, rx2, ry2));
      }

    }

    if (fn(ax, ay, bx, by, rx2, ry2, rx, ry2)) {

      if (isNaN(side) || fn2(ax, ay, rx2, ry2, rx, ry2) == side) {
        hits.push(Geom.lineLineIntersect(ax, ay, bx, by, rx2, ry2, rx, ry2));
      }

    }

    if (fn(ax, ay, bx, by, rx, ry2, rx, ry)) {

      if (isNaN(side) || fn2(ax, ay, rx, ry2, rx, ry) == side) {
        hits.push(Geom.lineLineIntersect(ax, ay, bx, by, rx, ry2, rx, ry));
      }

    }

    return hits;

  }

  export function gridPointsAlongLine(x0:number, y0:number, x1:number, y1:number):Array<number> {

    var a = [];

    var dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
    var dy = Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
    var err = (dx > dy ? dx : -dy) / 2;

    var i = 0;

    while (true) {
      a.push(x0);
      a.push(y0);
      if (x0 === x1 && y0 === y1) break;
      var e2 = err;
      if (e2 > -dx) { err -= dy; x0 += sx; }
      if (e2 < dy) { err += dx; y0 += sy; }
      i++;
      if (i > 512) {
        console.log(a);
        break;
      }
    }

    return a;

  }

  export function polygonArea(pts:Array<number>):number {

    let area = 0;

    for (let i = 0; i < pts.length; i += 2) {
      let j = (i + 2) % pts.length;
      area += pts[i] * pts[j + 1];
      area -= pts[j] * pts[i + 1];
    }

    return area / 2;

  }

  export function polygonIsClockwise(pts:Array<number>):boolean {

    return Geom.polygonArea(pts) > 0;

  }

  export function polygonIsClosed(pts:Array<number>):boolean {

    return (
      pts.length >= 6 && 
      pts[0] == pts[pts.length - 2] && 
      pts[1] == pts[pts.length - 1]
    );

  }

  export function closePolygon(pts:Array<number>):void {

    if (pts.length >= 4 && !Geom.polygonIsClosed(pts)) {
      pts.push(pts[0], pts[1]);
    }

  }

}