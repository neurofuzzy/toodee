namespace Geom {

  export interface IQuad<T> extends Array<T> {

  }

  export interface IQuadMap<T> {

    getQuadFromPoint (pt:IPoint):IQuad<any>;
    getQuadsFromCoords (coords:Array<IPoint>, removeDupes:boolean):Array<IQuad<any>>;

  }

}