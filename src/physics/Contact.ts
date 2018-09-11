namespace Physics {

  export class IContact<A,B> {
    itemA:A;
    itemB:B;
  }

  export class BaseContact<A, B> implements IContact<A, B> {

    public itemA:A;
    public itemB:B;

    constructor (itemA:A, itemB:B) {

      this.itemA = itemA;
      this.itemB = itemB;

    }    

  }

  export class BodyBodyContact extends BaseContact<Physics.IBody, Physics.IBody> {

  }

  
  export class BodyBoundaryContact extends BaseContact<Physics.IBody, Geom.ISegment> {

  }

}