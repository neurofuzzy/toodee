namespace Models {

  export enum EventType {
    Change = 1,
    Add,
    Remove,
  }

  export interface IEvent<T> {
    type:number;
    sourceID:number;
    targetID:number;
    payload:T;
  }

  export interface IEventListenerFunc {
    (event:IEvent<any>):void;
  }

  export interface IEventDispatcher {
    init():any;
    reset():void;
    addListener(listener:IEventListenerFunc, scope:any):void;
    removeListener(listener:IEventListenerFunc):void;
    dispatchEvent(event:IEvent<any>):void;
    dispatch(type:number, source:Models.Identifiable, target?:Identifiable, payload?:any):void;
  }

  export class Event<T> implements IEvent<T> {

    public type:number;
    public sourceID:number;
    public targetID:number;
    public payload:T;

    constructor (type:number, sourceID:number = -1, targetID:number = -1, payload:T) {

      this.type = type;
      this.sourceID = sourceID;
      this.targetID = targetID;
      this.payload = payload;

    }

    public static fromIDs (type:number, source:Identifiable, target:Identifiable = null, payload:any = null) {

      return new Event(
        type, 
        source ? source.id : -1, 
        target ? target.id : -1, 
        payload
      );

    }

  }

  export class EventDispatcher implements IEventDispatcher {
    
    protected listeners:Array<IEventListenerFunc>;
    protected listenerScopes:Array<any>;

    public init () {
      this.reset();
      return this;
    }

    public reset () {
      this.listeners = [];
      this.listenerScopes = [];
    }

    public addListener(listener:IEventListenerFunc, scope:any):void {

      this.listeners.push(listener);
      this.listenerScopes.push(scope);

    }

    public removeListener(listener:IEventListenerFunc):void {

      let idx = this.listeners.indexOf(listener);

      if (idx >= 0) {
        this.listeners.splice(idx, 1);
        this.listenerScopes.splice(idx, 1);
      }

    }

    public dispatchEvent(event:IEvent<any>) {

      this.listeners.forEach((listener, idx) => {
        
        let scope = this.listenerScopes[idx];
        listener.call(scope, event);

      });

    }

    public dispatch(type:number, source:Identifiable, target:Identifiable = null, payload:any = null) {

      let event = Event.fromIDs(type, source, target, payload);
      this.dispatchEvent(event);

    }

  }

}