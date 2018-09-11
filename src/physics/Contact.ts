namespace Physics {

  export class IContact<A,B> {
    itemA:A;
    itemB:B;
    angle:number;
  }

  export class BaseContact<A, B> implements IContact<A, B> {

    public itemA:A;
    public itemB:B;
    public angle:number;

    constructor (itemA:A, itemB:B) {

      this.itemA = itemA;
      this.itemB = itemB;

    }    

  }

  export class BodyBodyContact extends BaseContact<Physics.IBody, Physics.IBody> {

    constructor (itemA:Physics.IBody, itemB:Physics.IBody) {

      super(itemA, itemB);

      let a = itemA.bounds.anchor;
      let b = itemB.bounds.anchor;
    
      this.angle = Geom.angleBetween(a.x, a.y, b.x, b.y);

    }

  }
  
  export class BodyBoundaryContact extends BaseContact<Physics.IBody, Geom.ISegment> {

    constructor (itemA:Physics.IBody, itemB:Geom.ISegment) {

      super(itemA, itemB);

      let a = itemA.bounds.anchor;
      let b = Geom.closestPtPointLine(a, itemB.ptA, itemB.ptB);
    
      this.angle = Geom.angleBetween(a.x, a.y, b.x, b.y);

    }

  }

}