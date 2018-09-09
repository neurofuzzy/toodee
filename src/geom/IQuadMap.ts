namespace Geom {

  export interface IQuad<T> extends Array<T> {

  }

  export interface IQuadMap<T> {

    //bounds:IBounds;
    getQuadFromPoint (pt:IPoint):IQuad<any>;
    getQuadsFromCoords (coords:Array<IPoint>, removeDupes:boolean):Array<IQuad<any>>;

  }

}