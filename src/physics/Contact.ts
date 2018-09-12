namespace Physics {


  export class IContact<B> {
    penetration:Geom.IPoint;
    itemA:IBody;
    itemB:B;
  }

  export class BaseContact<B> implements IContact<B> {

    public penetration:Geom.IPoint;
    public itemA:IBody;
    public itemB:B;

    constructor (penetration:Geom.IPoint, itemA:IBody, itemB:B) {

      Geom.normalizePoint(penetration);

      this.penetration = penetration;
      this.itemA = itemA;
      this.itemB = itemB;

    }    

  }

  export class BodyBodyContact extends BaseContact<IBody> {

  }
  
  export class BodyBoundaryContact extends BaseContact<Geom.ISegment> {

  }

  export function resolveContact (contact:IContact<IBody | Geom.ISegment>):void {

    let pen = contact.penetration;

    let iA = contact.itemA;
    let vA = iA.velocity;
    let vAx = vA.x;
    let vAy = vA.y;

    if (contact instanceof BodyBodyContact) {

      let iB = contact.itemB;

      let vB = iB.velocity;

      let vBx = vB.x;
      let vBy = vB.y;

      if (iA.bounds.shape == Geom.SHAPE_ROUND && iB.bounds.shape == Geom.SHAPE_ROUND) {

        vA.x = vBx;
        vA.y = vBy;
        vB.x = vAx;
        vB.y = vAy;

      } else if (iA.bounds.shape == Geom.SHAPE_ROUND && iB.bounds.shape == Geom.SHAPE_ORTHO) {

        if (pen.x == 0) {

          vA.y = 0 - vAy;

        } 
        
        if (pen.y == 0) {

          vA.x = 0 - vAx;

        } 
        
        if (pen.x != 0 && pen.y != 0) {

          var vel = Geom.distanceBetween(0, 0, vAx, vAy);

          vA.x = pen.x * vel;
          vA.y = pen.y * vel;

        }

      }

    }
    
    if (contact instanceof BodyBoundaryContact) {

      let iB = contact.itemB;
      let angle = Geom.angleBetween(iB.ptA.x, iB.ptA.y, iB.ptB.x, iB.ptB.y);

      Geom.rotatePoint(vA, angle);
      vA.y = 0 - vA.y;
      Geom.rotatePoint(vA, 0 - angle);

    }

    
  }

}