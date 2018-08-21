namespace Util {

  export class Geom {

    public static pointWithinRect(x:number, y:number, rect:IRect, tilescale:number = 1):boolean {

      return (
        x >= rect.x * tilescale &&
        y >= rect.y * tilescale &&
        x <= (rect.x + rect.w) * tilescale &&
        y <= (rect.y + rect.h) * tilescale
      );

    };

    public static rectWithinRect(rectA:IRect, rectB:IRect):boolean {

      return (
        rectA.x >= rectB.x &&
        rectA.y >= rectB.y &&
        rectA.x + rectA.w <= rectB.x + rectB.w &&
        rectA.y + rectA.h <= rectB.y + rectB.h
      );

    };

    public static rectIntersectsRect(rectA:IRect, rectB:IRect):boolean {

      return (
        rectA.x + rectA.w >= rectB.x &&
        rectA.y + rectA.h >= rectB.y &&
        rectA.x <= rectB.x + rectB.w &&
        rectA.y <= rectB.y + rectB.h
      );

    };

    public static distanceBetweenXY(v1:IPoint, v2:IPoint):number {

      var dx = v1.x - v2.x, dy = v1.y - v2.y;
      return Math.sqrt(dx * dx + dy * dy);

    };

    public static distanceBetween(x1:number, y1:number, x2:number, y2:number):number {

      return Math.sqrt(Geom.distanceBetweenSquared(x1, y1, x2, y2));

    };

    public static distanceBetweenSquared(x1:number, y1:number, x2:number, y2:number):number {

      var dx = x2 - x1, dy = y2 - y1;
      return dx * dx + dy * dy;

    };

    public static angleBetween(x1:number, y1:number, x2:number, y2:number):number {

      return Math.atan2(y2 - y1, x2 - x1);

    };

    public static rotatePointDeg(pt:IPoint, deg:number):void {

      Geom.rotatePoint(pt, deg * Math.PI / 180);

    };

    public static rotatePoint(pt:IPoint, angle:number):void {

      angle = 0 - Geom.normalizeAngle(angle);

      var cos = Math.cos(angle);
      var sin = Math.sin(angle);
      var oldX = pt.x;
      var oldY = pt.y;

      pt.x = cos * oldX - sin * oldY;
      pt.y = sin * oldX + cos * oldY;

    };

    public static lerp(a:number, b:number, t:number):number {
      t = Math.max(0, Math.min(1, t));
      return a + (b - a) * t;
    };

    public static lerpDist(x1:number, y1:number, x2:number, y2:number, dist:number):IPoint {

      var len = Geom.distanceBetween(x1, y1, x2, y2);
      var perc = dist / len;

      return {
        x: Geom.lerp(x2, x1, perc),
        y: Geom.lerp(y2, y1, perc)
      }

    };

    public static normalizeAngle(ang:number):number {

      while (ang < 0 - Math.PI) {
        ang += Math.PI * 2;
      }

      while (ang > Math.PI) {
        ang -= Math.PI * 2;
      }

      return ang;

    };

    public static normalizeAngleDeg(ang:number):number {

      while (ang < -180) {
        ang += 360;
      }

      while (ang > 180) {
        ang -= 360;
      }

      return ang;

    };

    public static ccw(p1x:number, p1y:number, p2x:number, p2y:number, p3x:number, p3y:number):boolean {
      return (p3y - p1y) * (p2x - p1x) > (p2y - p1y) * (p3x - p1x);
    };

    public static lineIntersectsLine(p1x:number, p1y:number, p2x:number, p2y:number, p3x:number, p3y:number, p4x:number, p4y:number):boolean {
      var fn = Geom.ccw;
      return (
        fn(p1x, p1y, p3x, p3y, p4x, p4y) != fn(p2x, p2y, p3x, p3y, p4x, p4y) && 
        fn(p1x, p1y, p2x, p2y, p3x, p3y) != fn(p1x, p1y, p2x, p2y, p4x, p4y)
      );
    };

    public static lineLineIntersect(x1:number, y1:number, x2:number, y2:number, x3:number, y3:number, x4:number, y4:number):IPoint {

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

    };

    public static lineSide(x:number, y:number, x1:number, y1:number, x2:number, y2:number):number {
      return (x - x1) * (y2 - y1) - (y - y1) * (x2 - x1) > 0 ? 1 : -1;
    };

    public static rectIntersectsLine(rect:IRect, ax:number, ay:number, bx:number, by:number, side?:number):Array<IPoint> {

      var rx = rect.x;
      var ry = rect.y;
      var rx2 = rx + rect.w;
      var ry2 = ry + rect.h;

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

    };

    public static gridPointsAlongLine(x0:number, y0:number, x1:number, y1:number):Array<number> {

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

    };


    public static resolvePenetrationCircleRect(centerPt:IPoint, radius:number, rect:IRect, tilescale:number):number {

      var cx = centerPt.x;
      var cy = centerPt.y;
      var cx1 = cx - radius;
      var cy1 = cy - radius;
      var cx2 = cx + radius;
      var cy2 = cy + radius;

      tilescale = tilescale || 1;

      var rx1 = rect.x;
      var ry1 = rect.y;
      var rx2 = rx1 + rect.w;
      var ry2 = ry1 + rect.h;
      var rx = (rx1 + rx2) * 0.5;
      var ry = (ry1 + ry2) * 0.5;


      // bounds check, early out

      if (rx2 < cx1 || ry2 < cy1 || rx1 > cx2 || ry1 > cy2) {
        return 0;
      }

      // if inside rect

      if (rx2 > cx && ry2 > cy && rx1 < cx && ry1 < cy) {

        console.log("INSIDE");
        return -1;
        /*
                if (Math.abs(rx - cx) > Math.abs(ry - cy)) {
                    if (cx > rx) {
                        cx = centerPt.x = rx2 + radius;
                    } else {
                        cx = centerPt.x = rx1 - radius;
                    }
                } else {
                    if (cy > ry) {
                        cy = centerPt.y = ry2 + radius;
                    } else {
                        cy = centerPt.y = ry1 - radius;
                    }
                }
        */

        //return false;
      }


      var delta, angle;

      if (cx >= rx1 && cx <= rx2) {

        if (cy <= ry) {
          centerPt.y = ry1 - radius;
        } else {
          centerPt.y = ry2 + radius;
        }
        return 1;

      } else if (cy >= ry1 && cy <= ry2) {

        if (cx <= rx) {
          centerPt.x = rx1 - radius;
        } else {
          centerPt.x = rx2 + radius;
        }
        return 1;

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

        centerPt.x += delta * Math.cos(angle);
        centerPt.y += delta * Math.sin(angle);

        return 1;

      }

      return 0;

    };

    public static polygonArea(pts:Array<number>):number {

      let area = 0;

      for (let i = 0; i < pts.length; i += 2) {
        let j = (i + 2) % pts.length;
        area += pts[i] * pts[j + 1];
        area -= pts[j] * pts[i + 1];
      }

      return area / 2;

    };

    public static polygonIsClockwise(pts:Array<number>):boolean {

      return Geom.polygonArea(pts) > 0;

    };

    public static polygonIsClosed(pts:Array<number>):boolean {

      return (
        pts.length >= 6 && 
        pts[0] == pts[pts.length - 2] && 
        pts[1] == pts[pts.length - 1]
      );

    };

    public static closePolygon(pts:Array<number>):void {

      if (pts.length >= 4 && !Geom.polygonIsClosed(pts)) {
        pts.push(pts[0], pts[1]);
      }

    };

  }

}