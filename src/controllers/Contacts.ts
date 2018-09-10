namespace Controllers {

  export class BodyBodyContact {

    public itemA:Geom.IBody;
    public itemB:Geom.IBody;

    constructor (itemA:Geom.IBody, itemB:Geom.IBody) {

      this.itemA = itemA;
      this.itemB = itemB;

    }

  }
  
  export class BodyBoundaryContact {

    public itemA:Geom.IBody;
    public itemB:Geom.ISegment;

    constructor (itemA:Geom.IBody, itemB:Geom.ISegment) {

      this.itemA = itemA;
      this.itemB = itemB;

    }

  }

}