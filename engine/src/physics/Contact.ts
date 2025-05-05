namespace Physics {

  export interface IContactable {
    contactMask:number;
    resolveMask:number;
  }

  export class IContact<B> {
    penetration:Geom.IPoint;
    itemA:IBody;
    itemB:B;
  }

  export class BaseContact<B> implements IContact<B> {

    public penetration:Geom.IPoint;
    public itemA:IBody;
    public itemB:B;
    public corAB:number;

    constructor (penetration:Geom.IPoint, itemA:IBody, itemB:B, corAB:number = 1) {

      penetration = penetration.clone();

      Geom.normalizePoint(penetration);

      this.init(penetration, itemA, itemB, corAB);

    }

    init (penetration:Geom.IPoint, itemA:IBody, itemB:B, corAB:number = 1) {


      this.penetration = penetration;
      this.itemA = itemA;
      this.itemB = itemB;
      this.corAB = corAB;

    }

  }

  export class BodyBodyContact extends BaseContact<IBody> {

  }

  export class BodySegmentBodyContact extends BaseContact<ISegmentBody> {

    public hitPoint:Geom.IPointHit;

    init (penetration:Geom.IPoint, itemA:IBody, itemB:ISegmentBody, corAB:number = 1) {

      super.init(penetration, itemA, itemB, corAB);

      this.hitPoint = null;

    }
    
  }
  
  export class BodyBoundaryContact extends BaseContact<Geom.ISegment> {

  }

  export function resolveContact (contact:IContact<IBody | Geom.ISegment | ISegmentBody>):void {

    let pen = contact.penetration;

    let iA = contact.itemA;
    let vA = iA.velocity;

    if (contact instanceof BodyBodyContact) {

      let iB = contact.itemB;
      let vB = iB.velocity;

      Geom.scalePoint(vA, contact.corAB);
      Geom.scalePoint(vB, contact.corAB);

      if (iA.bounds.shape == Geom.SHAPE_ROUND && iB.bounds.shape == Geom.SHAPE_ROUND) {

        let aA = iA.bounds.anchor;
        let aB = iB.bounds.anchor;

        let angle = Geom.angleBetween(aA.x, aA.y, aB.x, aB.y);

        Geom.rotatePoint(vA, angle);
        Geom.rotatePoint(vB, angle);

        let vt = vA.x;
        vA.x = 0 - vB.x;
        vB.x = vt;
        
        Geom.rotatePoint(vA, 0 - angle);
        Geom.rotatePoint(vB, 0 - angle);

      } else if (iA.bounds.shape == Geom.SHAPE_ROUND && iB.bounds.shape == Geom.SHAPE_ORTHO) {

        let vAx = vA.x;
        let vAy = vA.y;

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

    } else if (contact instanceof BodyBoundaryContact) {

      let iB = contact.itemB;
      let angle = Geom.angleBetween(iB.ptA.x, iB.ptA.y, iB.ptB.x, iB.ptB.y);

      Geom.rotatePoint(vA, angle);
      vA.y = 0 - vA.y * contact.corAB;
      Geom.rotatePoint(vA, 0 - angle);

    } else if (contact instanceof BodySegmentBodyContact) {

      let iB = contact.itemB;

      if (iB.isBoundary) {
        
        let angle = Geom.angleBetween(iB.ray.ptA.x, iB.ray.ptA.y, iB.ray.ptB.x, iB.ray.ptB.y);
        Geom.rotatePoint(vA, angle);
        vA.y = 0 - vA.y * contact.corAB;
        Geom.rotatePoint(vA, 0 - angle);

      } else {

        let aA = iA.bounds.anchor;
        let hp = contact.hitPoint;

        let angle = Geom.angleBetween(aA.x, aA.y, hp.pt.x, hp.pt.y);

        Geom.rotatePoint(vA, angle);
        vA.x -= iB.pressure;
        Geom.rotatePoint(vA, 0 - angle);

      }
    
    }
    

    
  }

}