namespace Util.Geom {

  export interface ICell<T> extends Array<T> {

  }

  export interface IGrid<T> {

    getCellFromPoint (pt:IPoint):ICell<any>;
    getCellsFromCoords (coords:Array<IPoint>, removeDupes:boolean):Array<ICell<any>>;

  }

}