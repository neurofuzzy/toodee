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
      
        return distanceBetweenSquared(bA.anchor.x, bA.anchor.y, bB.anchor.x, bB.anchor.y) < (bA.hw + bB.hw) * (bA.hh + bB.hh);
      
      }

    } else {

      if (orthoIntersects) {

        return orthoRoundBoundsIntersect(bA, bB)

      }

    }

    return false;

  };

  export function pointWithinRectangle(x:number, y:number, rect:IRectangle, tilescale:number = 1):boolean {

    return (
      x >= rect.x1 &&
      y >= rect.y1 &&
      x <= rect.x2 &&
      y <= rect.y2
    );

  };

  export function rectangleWithinRectangle(rectA:IRectangle, rectB:IRectangle):boolean {

    return (
      rectA.x1 >= rectB.x1 &&
      rectA.y1 >= rectB.y1 &&
      rectA.x2 <= rectB.x2 &&
      rectA.y2 <= rectB.y2
    );

  };

  export function rectIntersectsRect(rectA:IRectangle, rectB:IRectangle):boolean {

    return (
      rectA.x2 >= rectB.x1 &&
      rectA.y2 >= rectB.y1 &&
      rectA.x1 <= rectB.x2 &&
      rectA.y1 <= rectB.y2
    );

  };

  export function distanceBetween(x1:number, y1:number, x2:number, y2:number):number {

    return Math.sqrt(distanceBetweenSquared(x1, y1, x2, y2));

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

      delta = distanceBetween(cx, cy, rx1, ry1);
      angle = angleBetween(cx, cy, rx1, ry1);

    } else if (cx > rx2 && cy < ry1) {

      delta = distanceBetween(cx, cy, rx2, ry1);
      angle = angleBetween(cx, cy, rx2, ry1);

    } else if (cx > rx2 && cy > ry2) {

      delta = distanceBetween(cx, cy, rx2, ry2);
      angle = angleBetween(cx, cy, rx2, ry2);

    } else {

      delta = distanceBetween(cx, cy, rx1, ry2);
      angle = angleBetween(cx, cy, rx1, ry2);

    }

    if (angle < 0) angle += Math.PI * 2;

    return (delta < radius);
    
  }

  export function rotatePointDeg(pt:IPoint, deg:number):void {

    rotatePoint(pt, deg * Math.PI / 180);

  };

  export function rotatePoint(pt:IPoint, angle:number):void {

    angle = 0 - normalizeAngle(angle);

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

    var len = distanceBetween(x1, y1, x2, y2);
    var perc = dist / len;

    return {
      x: lerp(x2, x1, perc),
      y: lerp(y2, y1, perc)
    }

  }

  export function normalizePoint(pt:IPoint):void {

    let len = distanceBetween(0, 0, pt.x, pt.y);

    if (len != 0) {

      pt.x /= len;
      pt.y /= len;

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

  export function closestPtPointLine (ptC:IPoint, ptA:IPoint, ptB:IPoint):IPoint {

    var pt;

    var ab = sub(ptB, ptA);
    var ca = sub(ptC, ptA);
    var t = dot(ca, ab);

    if (t < 0) {
      pt = ptA;
    } else {
      var denom = dot(ab, ab);
      if (t >= denom) {
        pt = ptB;
      } else {
        t /= denom;
        // reuse ca
        ca.x = ptA.x + t * ab.x;
        ca.y = ptA.y + t * ab.y;
        pt = ca;
      }
    }

    return pt;

  }

  export function ccw(p1x:number, p1y:number, p2x:number, p2y:number, p3x:number, p3y:number):boolean {
    return (p3y - p1y) * (p2x - p1x) > (p2y - p1y) * (p3x - p1x);
  }

  export function lineIntersectsLine(p1x:number, p1y:number, p2x:number, p2y:number, p3x:number, p3y:number, p4x:number, p4y:number):boolean {
    var fn = ccw;
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

  export function boundsLineIntersect(b:IBounds, segPtA:IPoint, segPtB:IPoint):Array<IPoint> {

    if (b.shape == SHAPE_ROUND) {
      return circleLineIntersect(b, segPtA, segPtB);
    } else {
      return rectLineIntersect(b, segPtA, segPtB);
    }

  }

  export function circleLineIntersect (bnds:IBounds, segPtA:IPoint, segPtB:IPoint):Array<IPoint> {
      
    let intPts:Array<IPoint> = [];

    var cx = bnds.anchor.x;
    var cy = bnds.anchor.y;
    var r = bnds.hw;
    var x1 = segPtA.x;
    var y1 = segPtA.y;
    var x2 = segPtB.x;
    var y2 = segPtB.y;

    var a = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1);
    var b = 2 * ((x2 - x1) * (x1 - cx) + (y2 - y1) * (y1 - cy));
    var cc = cx * cx + cy * cy + x1 * x1 + y1 * y1 - 2 * (cx * x1 + cy * y1) - r * r;
    var d = b * b - 4 * a * cc;
    
    if (d > 0) {

      var e = Math.sqrt(d);
      var u1 = (-b + e) / (2 * a);
      var u2 = (-b - e) / (2 * a);

      if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {

       // do nothing

      } else {

        if (0 <= u2 && u2 <= 1) {

          intPts.push({
            x: lerp(x1, x2, u2),
            y: lerp(y1, y2, u2)
          });

        }

        if (0 <= u1 && u1 <= 1) {
          intPts.push({
            x: lerp(x1, x2, u1),
            y: lerp(y1, y2, u1)
          });
        }

      }
    }

    return intPts

  };

  export function rectLineIntersect(b:IBounds, segPtA:IPoint, segPtB:IPoint, side?:number):Array<IPoint> {

    var ax = segPtA.x;
    var ay = segPtA.y;
    var bx = segPtB.x;
    var by = segPtB.y;
    var rx = b.anchor.x - b.hw;
    var ry = b.anchor.y - b.hh;
    var rx2 = rx + b.hw * 2;
    var ry2 = ry + b.hh * 2;

    // bounds check, early out

    if ((rx > ax && rx > bx) || (ry > ay && ry > by)) {
      return null;
    }

    if ((rx2 < ax && rx2 < bx) || (ry2 < ay && ry2 < by)) {
      return null;
    }

    // edge check

    var fn = lineIntersectsLine;
    var fn2 = lineSide;

    var hits = [];

    if (fn(ax, ay, bx, by, rx, ry, rx2, ry)) {

      if (isNaN(side) || fn2(ax, ay, rx, ry, rx2, ry) == side) {
        hits.push(lineLineIntersect(ax, ay, bx, by, rx, ry, rx2, ry));
      }

    }

    if (fn(ax, ay, bx, by, rx2, ry, rx2, ry2)) {

      if (isNaN(side) || fn2(ax, ay, rx2, ry, rx2, ry2) == side) {
        hits.push(lineLineIntersect(ax, ay, bx, by, rx2, ry, rx2, ry2));
      }

    }

    if (fn(ax, ay, bx, by, rx2, ry2, rx, ry2)) {

      if (isNaN(side) || fn2(ax, ay, rx2, ry2, rx, ry2) == side) {
        hits.push(lineLineIntersect(ax, ay, bx, by, rx2, ry2, rx, ry2));
      }

    }

    if (fn(ax, ay, bx, by, rx, ry2, rx, ry)) {

      if (isNaN(side) || fn2(ax, ay, rx, ry2, rx, ry) == side) {
        hits.push(lineLineIntersect(ax, ay, bx, by, rx, ry2, rx, ry));
      }

    }

    return hits;

  }

  export function cellCoordsAlongLine(x0:number, y0:number, x1:number, y1:number, gridSize:number = 20, intoArr?:Array<IPoint>):Array<IPoint> {

    intoArr = intoArr || [];

    var minx = Math.floor(Math.min(x0, x1) / gridSize);
    var maxx = Math.floor(Math.max(x0, x1) / gridSize);
    var miny = Math.floor(Math.min(y0, y1) / gridSize);
    var maxy = Math.floor(Math.max(y0, y1) / gridSize);
    var sides = [];

    for (var j = miny; j <= maxy + 1; j++) {

      sides[j] = [];

      for (var i = minx; i <= maxx + 1; i++) {

        sides[j][i] = lineSide(i * gridSize, j * gridSize, x0, y0, x1, y1);

      }

    }

    for (var j = miny; j <= maxy; j++) {

      for (var i = minx; i <= maxx; i++) {

        if (Math.abs(sides[j][i] + sides[j][i + 1] + sides[j + 1][i + 1] + sides[j + 1][i]) != 4) {
          intoArr.push(new Point(i, j));
        }

      }

    }

    return intoArr;

  }

  export function cellCoordsAlongLineWithThickness (x0:number, y0:number, x1:number, y1:number, gridSize:number = 20, thickness:number = 0, intoArr?:Array<IPoint>):Array<IPoint> {

    if (thickness == 0) {

      return cellCoordsAlongLine(x0, y0, x1, y1, gridSize, intoArr);

    } else {

      intoArr = cellCoordsAlongLine(x0, y0, x1, y1, gridSize, intoArr);

      let angle = angleBetween(x0, y0, x1, y1);

      let sinang = Math.sin(0 - angle);
      let cosang = Math.cos(0 - angle);

      x0 += sinang * thickness;
      y0 += cosang * thickness;
      x1 += sinang * thickness;
      y1 += cosang * thickness;

      intoArr = cellCoordsAlongLine(x0, y0, x1, y1, gridSize, intoArr);

      x0 -= sinang * thickness * 2;
      y0 -= cosang * thickness * 2;
      x1 -= sinang * thickness * 2;
      y1 -= cosang * thickness * 2;

      intoArr = cellCoordsAlongLine(x0, y0, x1, y1, gridSize, intoArr);

      return intoArr;

    }

  }

  export function cellCoordsContainingPolygon (poly:IPolygon, gridSize:number, padding:number = 0):Array<IPoint> {
    
    let intoArr:Array<IPoint> = [];
    let plen = poly.segments.length;

    for (let i = 0; i < plen; i++) {

      let seg = poly.segments[i];
      cellCoordsAlongLineWithThickness(seg.ptA.x, seg.ptA.y, seg.ptB.y, seg.ptB.y, gridSize, padding, intoArr);

    }

    return intoArr;

  }

  export function cellCoordsIntersectingCircle (center:IPoint, radius:number, gridSize:number):Array<IPoint> {
    
    let a:Array<IPoint> = [];

    radius += gridSize * 0.5 * 1.4142;
    
    var minx = Math.floor((center.x - radius) / gridSize);
    var maxx = Math.ceil((center.x + radius) / gridSize);
    var miny = Math.floor((center.y - radius) / gridSize);
    var maxy = Math.ceil((center.y + radius) / gridSize);

    let testPt = { x: 0, y: 0 };
    let hg = gridSize * 0.5;

    for (let y = miny; y <= maxy; y++) {

      for (let x = minx; x <= maxx; x++) {

        testPt.x = x * gridSize + hg;
        testPt.y = y * gridSize + hg;

        if (distanceBetween(center.x, center.y, testPt.x, testPt.y) < radius) {
          a.push(new Point(x, y));
        }

      }

    }


    return a;

  }

  export function polygonArea(pts:Array<IPoint>):number {

    let area = 0;

    for (let i = 0; i < pts.length; i++) {
      let ptA = pts[i];
      let ptB = pts[(i + 1) % pts.length];
      area += ptA.x * ptB.y;
      area -= ptB.x * ptA.y;
    }

    return area / 2;

  }

  export function polygonIsClockwise(pts:Array<IPoint>):boolean {

    return polygonArea(pts) > 0;

  }

  export function linePolygonIntersect (linePtA:IPoint, linePtB:IPoint, poly:IPolygon):Array<IPoint> {

    let pts:Array<IPoint> = [];

    poly.segments.forEach(seg => {

      let intPt = lineLineIntersect(linePtA.x, linePtA.y, linePtB.x, linePtB.y, seg.ptA.x, seg.ptA.y, seg.ptB.x, seg.ptB.y);

      if (intPt != null) {
        pts.push(intPt);
      }

    });

    return pts;

  }

  export function pointInPolygon (pt:IPoint, poly:IPolygon):boolean {

    // early out
    if (!pointWithinRectangle(pt.x, pt.y, poly.boundingBox)) {
      return;
    }

    let startPt:IPoint = { x: poly.boundingBox.x1 - 100, y: poly.boundingBox.y1 - 100 };

    let pts = linePolygonIntersect(startPt, pt, poly);

    return !(pts.length % 2 == 0);

  }

  export function polygonInPolygon (polyA:IPolygon, polyB:IPolygon):boolean {

    // early out
    if (!rectIntersectsRect(polyA.boundingBox, polyB.boundingBox)) {
      return;
    }

    let startPt:IPoint = { x: polyB.boundingBox.x1 - 100, y: polyB.boundingBox.y1 - 100 };

    for (let i = 0; i < polyA.vertices.length; i++) {

      let pt = polyA.vertices[i];
      let pts = linePolygonIntersect(startPt, pt, polyB);

      if (pts.length % 2 == 0)  {
        return false;
      }

    }

    return true;

  }

}