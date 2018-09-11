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

    if (contact instanceof BodyBodyContact) {

      let pen = contact.penetration;

      let iA = contact.itemA;
      let iB = contact.itemB;

      let vA = iA.velocity;
      let vB = iB.velocity;

      let vAx = vA.x;
      let vAy = vA.y;
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

     // contact.itemB.

    }

    
  }

}